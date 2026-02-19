const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: 'lsk5czic',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
});

const GOOGLE_SVG_ICON = `<svg class="google-icon" viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`;

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildReviewCard(review) {
  const initial = review.name.charAt(0).toUpperCase();
  const stars = '&#9733;'.repeat(review.rating || 5);
  const source = review.source || 'Google Review';
  return `<div class="reviews-carousel-slide"><div class="google-review-card">${GOOGLE_SVG_ICON}<div class="review-header"><div class="review-avatar">${initial}</div><div class="review-meta"><strong>${escapeHtml(review.name)}</strong><span>${escapeHtml(source)}</span></div></div><div class="review-stars">${stars}</div><p class="review-text">${escapeHtml(review.text)}</p></div></div>`;
}

function buildTrustItem(item) {
  return `<div class="trust-item"><span class="icon">${item.icon}</span> ${escapeHtml(item.text)}</div>`;
}

function buildHeroStat(stat) {
  if (stat.isReviewScore) {
    return `<div class="stat-item hero-review-score"><a href="#reviews" style="text-decoration: none; color: inherit;"><strong style="color: #fbbc05;">${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span></a></div>`;
  }
  return `<div class="stat-item"><strong>${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span></div>`;
}

function buildFeatureCard(feature) {
  return `<div class="feature-card"><div class="feature-icon">${feature.icon}</div><div><h3>${escapeHtml(feature.title)}</h3><p>${escapeHtml(feature.description)}</p></div></div>`;
}

function buildServiceItem(item) {
  return `<li>${escapeHtml(item)}</li>`;
}

function buildPricingItem(item) {
  return `<li><span>${escapeHtml(item.label)}</span><span>${escapeHtml(item.price)}</span></li>`;
}

function buildGallerySlide(img) {
  return `<div class="gallery-carousel-slide"><div class="gallery-item"><img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.alt)}"></div></div>`;
}

function buildRegionTag(name) {
  return `<span class="region-tag">${escapeHtml(name)}</span>`;
}

function replaceSection(html, startMarker, endMarker, newContent) {
  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) return html;
  const endIdx = html.indexOf(endMarker, startIdx + startMarker.length);
  if (endIdx === -1) return html;
  return html.substring(0, startIdx + startMarker.length) + '\n' + newContent + '\n' + html.substring(endIdx);
}

function replaceInnerContent(html, openTag, closeTag, newContent) {
  const startIdx = html.indexOf(openTag);
  if (startIdx === -1) return html;
  const afterOpen = startIdx + openTag.length;
  const endIdx = html.indexOf(closeTag, afterOpen);
  if (endIdx === -1) return html;
  return html.substring(0, afterOpen) + newContent + html.substring(endIdx);
}

async function build() {
  console.log('Fetching content from Sanity...');

  // Fetch all content types in parallel
  const [hero, trustItems, reviews, aboutData, services, features, pricing, gallery, regions, contact] = await Promise.all([
    client.fetch('*[_type == "hero"][0]'),
    client.fetch('*[_type == "trustItem"] | order(order asc)'),
    client.fetch('*[_type == "review"] | order(order asc)'),
    client.fetch('*[_type == "about"][0]'),
    client.fetch('*[_type == "services"][0]'),
    client.fetch('*[_type == "feature"] | order(order asc)'),
    client.fetch('*[_type == "pricingCard"] | order(order asc)'),
    client.fetch('*[_type == "galleryImage"] | order(order asc)'),
    client.fetch('*[_type == "region"] | order(order asc)'),
    client.fetch('*[_type == "contact"][0]'),
  ]);

  // Read the original index.html as base
  let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

  // === HERO SECTION ===
  if (hero) {
    // Replace hero title
    html = html.replace(
      /<h1>Huiselijke<br><span>hondenopvang<\/span><br>met liefde<\/h1>/,
      `<h1>${hero.title}</h1>`
    );
    // Replace hero text
    html = html.replace(
      /(<p class="hero-text">)\s*[\s\S]*?(<\/p>)/,
      `$1\n                    ${escapeHtml(hero.subtitle)}\n                $2`
    );
    // Replace hero stats
    if (hero.stats && hero.stats.length > 0) {
      const statsHtml = hero.stats.map(buildHeroStat).join('\n                    ');
      html = replaceInnerContent(html, '<div class="hero-stats">', '</div>\n            </div>\n            <div class="hero-visual">', '\n                    ' + statsHtml + '\n                ');
    }
  }

  // === TRUST BAR ===
  if (trustItems && trustItems.length > 0) {
    const trustHtml = trustItems.map(buildTrustItem).join('\n                ');
    html = replaceInnerContent(html, '<div class="trust-items">', '\n            </div>\n        </div>\n    </div>\n\n    <!-- TESTIMONIALS', '\n                ' + trustHtml + '\n            ');
  }

  // === REVIEWS ===
  if (reviews && reviews.length > 0) {
    const reviewsHtml = reviews.map(buildReviewCard).join('\n                        ');
    // Replace everything inside the carousel inner
    const carouselStart = '<div class="reviews-carousel-inner" id="carouselInner">';
    const carouselEnd = '</div>\n                </div>\n                <div class="carousel-dots"';
    html = replaceInnerContent(html, carouselStart, carouselEnd, '\n\n                        ' + reviewsHtml + '\n\n                    ');
  }

  // === ABOUT SECTION ===
  if (aboutData) {
    // Replace about paragraphs
    const aboutParagraphs = aboutData.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('\n                ');
    const aboutStart = '<h2 class="section-title">Over mij</h2>';
    // Replace from after title to before about-features
    const aboutTitleIdx = html.indexOf(aboutStart);
    if (aboutTitleIdx !== -1) {
      const afterTitle = aboutTitleIdx + aboutStart.length;
      const featuresStart = html.indexOf('<div class="about-features">', afterTitle);
      if (featuresStart !== -1) {
        html = html.substring(0, afterTitle) + '\n                ' + aboutParagraphs + '\n                ' + html.substring(featuresStart);
      }
    }

    // Replace about features/credentials
    if (aboutData.credentials && aboutData.credentials.length > 0) {
      const credentialsHtml = aboutData.credentials.map(c =>
        `<div class="about-feature"><span class="check">&#10003;</span>${escapeHtml(c)}</div>`
      ).join('\n                    ');
      html = replaceInnerContent(html, '<div class="about-features">', '\n                </div>\n            </div>\n        </div>\n    </section>\n\n    <!-- SERVICES', '\n                    ' + credentialsHtml + '\n                ');
    }
  }

  // === SERVICES ===
  if (services && services.items && services.items.length > 0) {
    const servicesHtml = services.items.map(buildServiceItem).join('\n                        ');
    html = replaceInnerContent(html, '<ul class="services-checklist">', '\n                    </ul>', '\n                        ' + servicesHtml + '\n                    ');
  }

  // === FEATURES ===
  if (features && features.length > 0) {
    const featuresHtml = features.map(buildFeatureCard).join('\n                ');
    html = replaceInnerContent(html, '<div class="features-grid">', '\n            </div>\n        </div>\n    </section>\n\n    <!-- PRICING', '\n                ' + featuresHtml + '\n            ');
  }

  // === PRICING ===
  if (pricing && pricing.length > 0) {
    const pricingHtml = pricing.map(card => {
      const isFeatured = card.featured ? ' featured' : '';
      const badge = card.featured ? `<span class="pricing-badge">${escapeHtml(card.badge || 'Populair')}</span>` : '';
      const items = card.items.map(buildPricingItem).join('\n                            ');
      const btnClass = card.featured ? 'btn-primary' : 'btn-secondary';
      const btnText = escapeHtml(card.buttonText || 'Meer info');
      return `<div class="pricing-card${isFeatured}">
                    ${badge}
                    <div class="pricing-header">
                        <span class="emoji">${card.icon}</span>
                        <h3>${escapeHtml(card.title)}</h3>
                        <span class="desc">${escapeHtml(card.subtitle)}</span>
                    </div>
                    <div class="pricing-body">
                        <ul>
                            ${items}
                        </ul>
                    </div>
                    <div class="pricing-footer">
                        <a href="#contact" class="btn ${btnClass}">${btnText}</a>
                    </div>
                </div>`;
    }).join('\n\n                ');
    html = replaceInnerContent(html, '<div class="pricing-grid">', '\n            </div>\n        </div>\n    </section>\n\n    <!-- GALLERY', '\n                ' + pricingHtml + '\n            ');
  }

  // === GALLERY ===
  if (gallery && gallery.length > 0) {
    const galleryHtml = gallery.map(img => {
      const url = img.imageUrl || img.filename;
      return buildGallerySlide({ url, alt: img.alt || '' });
    }).join('\n                        ');
    html = replaceInnerContent(html, '<div class="gallery-carousel-inner" id="galleryInner">', '\n                    </div>\n                </div>\n                <div class="gallery-dots"', '\n                        ' + galleryHtml + '\n                    ');
  }

  // === REGIONS ===
  if (regions && regions.length > 0) {
    const regionsHtml = regions.map(r => buildRegionTag(r.name)).join('\n                ');
    html = replaceInnerContent(html, '<div class="region-tags">', '\n            </div>', '\n                ' + regionsHtml + '\n            ');
  }

  // === CONTACT ===
  if (contact) {
    // Replace phone number
    if (contact.phone) {
      const phoneClean = contact.phone.replace(/\s/g, '');
      html = html.replace(/href="tel:\+32496157594"/g, `href="tel:${phoneClean}"`);
      html = html.replace(/0496 15 75 94/g, contact.phone);
      html = html.replace(/\+32 496 15 75 94/g, contact.phone);
    }
    // Replace email
    if (contact.email) {
      html = html.replace(/dierenoppasmel@gmail\.com/g, contact.email);
      html = html.replace(/href="mailto:dierenoppasmel@gmail\.com"/g, `href="mailto:${contact.email}"`);
    }
    // Replace address
    if (contact.address) {
      html = html.replace(/Elzentapstraat 4, 8630 Veurne/g, contact.address);
      html = html.replace(/Elzentapstraat 4/g, contact.addressStreet || 'Elzentapstraat 4');
      html = html.replace(/8630 Veurne, Belgi&euml;/g, contact.addressCity || '8630 Veurne, Belgi&euml;');
    }
  }

  // Write the output
  const outPath = path.join(__dirname, 'dist', 'index.html');
  fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });

  // Copy all static assets to dist
  const staticFiles = fs.readdirSync(__dirname).filter(f =>
    f.endsWith('.png') || f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.mp4') || f === 'algemene-voorwaarden.html'
  );
  for (const file of staticFiles) {
    fs.copyFileSync(path.join(__dirname, file), path.join(__dirname, 'dist', file));
  }

  fs.writeFileSync(outPath, html, 'utf8');
  console.log('Build complete! Output written to dist/index.html');
  console.log(`Injected: ${reviews?.length || 0} reviews, ${features?.length || 0} features, ${pricing?.length || 0} pricing cards, ${gallery?.length || 0} gallery images`);
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});

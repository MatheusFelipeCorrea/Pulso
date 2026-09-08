const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

  await page.addInitScript(() => {
    localStorage.setItem('ds-theme-preference', JSON.stringify('dark'));
  });
  await page.goto('http://localhost:5173/login');
  await page.fill('input[name="identificador"]', 'matheusfelipecorreasilva@hotmail.com');
  await page.fill('input[name="senha"]', 'Pulso@123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);

  await page.goto('http://localhost:5173/groups/cmrc7jgej00cggcfzhd40xl2o');
  await page.waitForTimeout(1200);

  for (const sel of ['.group-detail-card__title-icon', '.group-detail-goal__icon']) {
    const box = await page.locator(sel).first().boundingBox();
    const svgBox = await page.locator(sel).first().locator('svg').boundingBox();
    console.log(sel, 'container:', JSON.stringify(box), 'svg:', JSON.stringify(svgBox));
    const leftGap = svgBox.x - box.x;
    const rightGap = (box.x + box.width) - (svgBox.x + svgBox.width);
    const topGap = svgBox.y - box.y;
    const bottomGap = (box.y + box.height) - (svgBox.y + svgBox.height);
    console.log('  gaps L/R/T/B:', leftGap.toFixed(2), rightGap.toFixed(2), topGap.toFixed(2), bottomGap.toFixed(2));
  }

  await browser.close();
})();

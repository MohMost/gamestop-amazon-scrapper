import { Product } from "models/product";
import { Search } from "models/search";
import puppeteer from "puppeteer";

const searchProducts = async () => {
  let games = [];
  const browser = await puppeteer.launch({
    headless: process.env.HEADLESS_BROWSER == "true",
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });
  const searchResults = await Search.find({
    where: {
      active: true,
    },
  });
  for (let index = 0; index < searchResults.length; index++) {
    const search = searchResults[index];
    const name = (search.q || "").split(" ").join("-");
    await page.setDefaultNavigationTimeout(0);
    await page
      .goto(`https://www.gamestop.com/video-games/${name}`, {
        waitUntil: "networkidle0",
      })
      .catch((err) => console.log("error loading url", err));
    try {
      console.timeEnd("search about" + " " + search.q);
    } catch (error) {
      console.log("eeeerrrrrrr", error);
    }
    try {
      let morePage = 30;
      while (morePage > 0) {
        morePage--;
        await page.waitForSelector(
          "#product-search-results > div.align-items-start.flex-nowrap.flex-column.flex-md-row > div > div.row.product-grid > div.row.js-paginationbar.plp-pagination > div.col-12.text-center.page-numbers > a.right-arrow"
        );
        await page.click(
          "#product-search-results > div.align-items-start.flex-nowrap.flex-column.flex-md-row > div > div.row.product-grid > div.row.js-paginationbar.plp-pagination > div.col-12.text-center.page-numbers > a.right-arrow"
        );
      }
    } catch (e) {
      console.log("Error while navigating pages:", e);
    }
    let links = await page.$$(
      "#product-search-results > div.align-items-start.flex-nowrap.flex-column.flex-md-row > div > div.row.product-grid > div.row.infinitescroll-results-grid.product-grid-redesign.wide-tiles > div > div"
    );

    for (let i = 0; i < links.length; i++) {
      const products = await links[i].$(
        "div.d-flex.flex-column.full-height.justify-content-between > div.tile-body > div > a > div > p"
      );
      const prices = await links[i].$(
        "div.d-flex.flex-column.full-height.justify-content-between > div.tile-price > div.conditions-pricing-on-plp > div > div > div > div > span > span > span.actual-price.actual-price-strikethroughable-span"
      );

      const images = await links[i].$(
        "div.image-container.col-4.col-sm-auto > a > picture > img"
      );
      try {
        const title = await page
          .evaluate((el) => el.textContent, products)
          .catch((e) => console.log("content error", e));
        const price = await page
          .evaluate((el) => el.textContent, prices)
          .catch((e) => console.log("content error", e));
        const category = search.q;
        const id = await page.evaluate(
          (item) => item.getAttribute("data-pid"),
          links[i]
        );

        const idArr = id.split("-");
        let idFilter = () => {
          if (id.length > 8 && idArr[0] === idArr[1]) {
            return idArr[0];
          } else {
            return id;
          }
        };
        const dateString = "18 mars 2023";
        const date = new Date(dateString);
        const formattedDate = date;

        if (!!id) {
          try {
            const product = new Product();

            product.id_in_website = idFilter();
            product.title = title;
            product.price = price ? price.match(/\$\d+\.\d{2}/)[0] : " ";
            product.image = `https://media.gamestop.com/i/gamestop/${idFilter()}`;
            product.published_at = formattedDate;
            product.category = category.split("-").join(" ");
            product.search = search.id;

            const insertion = await product.save();
            console.log("insertion:", insertion);
          } catch (e) {
            console.log("e:", e);
          }
        }
      } catch (e) {
        console.log("big error", e);
      }
    }
    console.log(`page ${search.q} is scraped ✅`);
  }
};
export default searchProducts;
//cd C:\xampp\mysql\bin\ && mysql -u root  nintendo switch  playstation 5 playstation 4 retro gaming xbox one

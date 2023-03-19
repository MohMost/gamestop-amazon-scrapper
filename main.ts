import "reflect-metadata";
import AppDataSource from "./db";
import searchProducts from "operations/searchProduct";
import getJobInfo from "operations/getJobInfo";

(async () => {
  try {
    await AppDataSource.initialize();
  } catch (e) {
    console.log("Error :", e);
  }

  await searchProducts();
})();

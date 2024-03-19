const authenticate = require("../../middleware/Authenticate");
const {
  validateCreateWatchlistRequest,
  validateDeleteWatchlist,
} = require("../../validators/UserWatchlistValidator");

const UserWatchListController = require("../../controllers/user").watchList;

const router = require("express").Router();

router.get("/", authenticate, UserWatchListController.getWatchList);
router.post(
  "/create",
  authenticate,
  validateCreateWatchlistRequest,
  UserWatchListController.createWatchlist,
);
router.delete(
  "/",
  authenticate,
  validateDeleteWatchlist,
  UserWatchListController.deleteWatchList,
);
router.post("/add", authenticate, UserWatchListController.addTickerToWatchList);
router.post(
  "/delete",
  authenticate,
  UserWatchListController.removeTickerFromWatchList,
);

module.exports = router;

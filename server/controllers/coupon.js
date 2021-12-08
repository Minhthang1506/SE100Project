const { getCurrentDateTimeString } = require("../helper/DateTime");
// db model
const Coupon = require("../models/coupon");

class CouponTab {
    //product
    getCoupon = async (req, res) => {
        var filter =
            typeof req.body.filter === "object"
                ? req.body.filter
                : JSON.parse(req.body.filter);

        Coupon.find(filter)
            .exec()
            .then((data) => {
                res.status(200).send(
                    JSON.stringify({
                        email: res.locals.decoded.email,
                        token: res.locals.newToken,
                        data,
                    })
                );
            })
            .catch((err) => {
                res.status(404).send(err);
            });
    };

    createCoupon = async (req, res) => {
        var reqCoupon = req.body.coupon;

        var newCoupon = new Coupon({
            ...reqCoupon
        });

        newCoupon
            .save()
            .then((data) => {
                res.status(200).send(
                    JSON.stringify({
                        email: res.locals.decoded.email,
                        token: res.locals.newToken,
                        data,
                    })
                );
            })
            .catch((err) => {
                res.status(404).send(err);
            });
    };

    updateCoupon = async (req, res) => {
        var reqCoupon = req.body.coupon;
        reqCoupon.timeFrom = new Date(reqCoupon.timeFrom)
        reqCoupon.timeEnd = new Date(reqCoupon.timeEnd)
        let coupons = await Coupon.findOne({ "_id.couponID": reqCoupon._id.couponID, "_id.storeID": reqCoupon._id.storeID })

        Coupon.findOneAndUpdate({ "_id.couponID": reqCoupon._id.couponID, "_id.storeID": reqCoupon._id.storeID }, reqCoupon, {
            returnOriginal: false,
        })
            .then((data) => {
                res.status(200).send(
                    JSON.stringify({
                        email: res.locals.decoded.email,
                        token: res.locals.newToken,
                        data,
                    })
                );
            })
            .catch((err) => {
                res.status(404).send(err);
            });
    };

    deleteCoupon = async (req, res) => {
        var reqCoupon = req.body._id;

        Coupon.deleteOne(reqCoupon)
            .then((data) => {
                res.status(200).send(
                    JSON.stringify({
                        email: res.locals.decoded.email,
                        token: res.locals.newToken,
                    })
                );
            })
            .catch((err) => {
                res.status(404).send(err);
            });
    };
}

module.exports = new CouponTab();

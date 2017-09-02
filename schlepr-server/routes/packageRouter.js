var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('router:packages')
var mongoose = require('mongoose');
var Packages = require('../models/packages');
var Verify = require('./verify');

var packageRouter = express.Router();
packageRouter.use(bodyParser.json());

packageRouter.route('/')
.get(function (req, res, next) {
    Packages.find(req.query)
    .populate('postedBy')
    .populate('comments.postedBy')
    .exec(function (err, packages) {
        if (err) return next(err);
        debug("Find query: " + req.query);
        res.json(packages);
    });
})
.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Packages.create(req.body, function (err, package) {
        if (err) return next(err);
        debug('Package created: ' + package._id);
        res.json(package);
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function (req, res, next) {
    Packages.remove({}, function (err, resp) {
        if (err) return next(err);
        debug('Delete all packages!!!');
        res.json(resp);
    });
});

packageRouter.route('/:packageId')
.get(function (req, res, next) {
    Packages.findById(req.params.packageId)
    .populate('postedBy')
    .populate('comments.postedBy')
    .exec(function (err, package) {
        if (err) return next(err);
        debug('Get package with id: ' + package._id);
        res.json(package);
    });
})
.put(Verify.verifyOrdinaryUser, function (req, res, next) {
    Packages.findByIdAndUpdate(req.params.packageId, {
        $set: req.body
    }, {
        new: true
    }, function (err, package) {
        if (err) return next(err);
        debug('Updated package with id: ' + package._id);
        res.json(package);
    });
})
.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Packages.findByIdAndRemove(req.params.packageId, function (err, resp) {
        if (err) return next(err);
        debug('Delete package with id: ' + req.params.packageId);
        res.json(resp);
    });
});

packageRouter.route('/:packageId/comments')
.get(function (req, res, next) {
    Packages.findById(req.params.packageId)
    .populate('comments.postedBy')
    .exec(function (err, package) {
        if (err) return next(err);
        debug('Get comments for package with id: ' + package._id);
        res.json(package.comments);
    });
})
.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Packages.findById(req.params.packageId, function (err, package) {
        if (err) return next(err);
        req.body.postedBy = req.decoded._id;
        package.comments.push(req.body);
        package.save(function (err, package) {
            if (err) return next(err);
            debug('Update comments for package with id: ' + package._id);
            res.json(package);
        });
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function (req, res, next) {
    Packages.findById(req.params.packageId, function (err, package) {
        if (err) return next(err);
        for (var i = (package.comments.length - 1); i >= 0; i--) {
            package.comments.id(package.comments[i]._id).remove();
        }
        package.save(function (err, result) {
            if (err) return next(err);
            debug('Delete all comments for package with id: ' + package._id);
            res.json(result);
        });
    });
});

packageRouter.route('/:packageId/comments/:commentId')
.get(function (req, res, next) {
    Packages.findById(req.params.packageId)
        .populate('comments.postedBy')
        .exec(function (err, package) {
        if (err) return next(err);
        debug('Get comment with id: ' + req.params.commentId + '; for package with id: ' + package._id);
        res.json(package.comments.id(req.params.commentId));
    });
})
.put(Verify.verifyOrdinaryUser, function (req, res, next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
    Packages.findById(req.params.packageId, function (err, package) {
        if (err) return next(err);
        package.comments.id(req.params.commentId).remove();
        req.body.postedBy = req.decoded._id;
        package.comments.push(req.body);
        package.save(function (err, package) {
            if (err) return next(err);
            debug('Update comment with id: ' + req.params.commentId + '; for package with id: ' + package._id);
            res.json(package);
        });
    });
})
.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Packages.findById(req.params.packageId, function (err, package) {
        if (package.comments.id(req.params.commentId).postedBy !== req.decoded._id) {
            var err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }
        package.comments.id(req.params.commentId).remove();
        package.save(function (err, resp) {
            if (err) return next(err);
            debug('Delete comment with id: ' + req.params.commentId + '; for package with id: ' + package._id);
            res.json(resp);
        });
    });
});

module.exports = packageRouter;
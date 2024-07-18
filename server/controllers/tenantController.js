const Tenant = require("../models/tenantSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.createTenant = async(req ,res)=> {
    const templeId = req.params.templeId ; 
    const tenantData = req.body ; 

    if(!templeId) {
        throw new ExpressError(400, "Temple Id is required.");
    }

    if(!tenantData) {
        throw new ExpressError(404, "Please provide valid tenant data.");
    }

    const newTenant = new Tenant({
        ...tenantData,
        templeId : templeId
    });

    await newTenant.save();

    res.status(200).json({ message : "Tenant added successfully." });
}

module.exports.getTenantsData = async (req, res, next) => {
    const templeId = req.params.templeId;
    const search = req.query.search;

    if (!templeId) {
        return next(new ExpressError(400, "Temple ID is required."));
    }

    let tenants;

    if (!search) {
        tenants = await Tenant.find({ templeId: templeId });
    } else {
        const searchRegex = new RegExp(search, 'i'); 
        tenants = await Tenant.find({
            templeId: templeId,
            $or: [
                { name: { $regex: searchRegex } },
                { contactInfo: { $regex: searchRegex } },
                { email: { $regex: searchRegex } },
                { address: { $regex: searchRegex } },
                { status: { $regex: searchRegex } }
            ]
        });
    }

    res.status(200).json({ tenants });
};
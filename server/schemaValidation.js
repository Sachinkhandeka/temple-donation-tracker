const Joi = require("joi");

//donation schema validation 
const daanSchema = Joi.object({
    donation: Joi.object({
        _id: Joi.string(),
        createdAt: Joi.date(),
        updatedAt: Joi.date(),
        __v: Joi.number(),
        donorName: Joi.string().required().error(new Error('Donor name is required')),
        sevaName: Joi.string().required().error(new Error('Seva name is required')),
        country: Joi.string().required().error(new Error('Country is required')),
        state: Joi.string().required().error(new Error('State is required')),
        district: Joi.string().required().error(new Error('District is required')),
        tehsil: Joi.string().required().error(new Error('Tehsil is required')),
        village: Joi.string().required().error(new Error('Village is required')),
        contactInfo: Joi.number().integer().required().min(1000000000).max(9999999999)
            .error(new Error('Contact info must be a 10-digit number')),
        paymentMethod: Joi.string().valid("cash", "bank", "upi").required().error(new Error('Invalid payment method')),
        donationAmount: Joi.number().required().error(new Error('Donation amount is required')),
    }).required().options({ abortEarly: false })
});

//permissions schema validation 
const permissionSchema = Joi.object({
    permissionName: Joi.string().valid(
        'donation-creator',
        'donation-viewer',
        'donation-editor',
        'donation-deleter',
        'donation-contributor',
        'donation-manager',
        'donation-supervisor'
    ).required().error(new Error('Invalid permission name')),
    templeId: Joi.string().required().error(new Error('Temple ID is required')),
    actions: Joi.array().items(Joi.string().valid('create', 'read', 'update', 'delete')).required().error(new Error('Invalid actions')),
}).required().options({ abortEarly: false });

//role schema validations
const roleSchema = Joi.object({
    templeId: Joi.string().required().error(new Error('Temple ID is required')),
    name: Joi.string().required().error(new Error('Role name is required')),
    permissions: Joi.array().required().error(new Error('Invalid permissions')),
}).required().options({ abortEarly: false });

//superAdmin schema validations
const superAdminSchema = Joi.object({
    username: Joi.string().required().error(new Error('Username is required')),
    email: Joi.string().email().required().error(new Error('Invalid email')),
    password: Joi.string().required().error(new Error('Password is required')),
    isAdmin: Joi.boolean().default(true),
    profilePicture: Joi.string().default('https://www.clipartmax.com/png/middle/82-820644_author-image-admin-icon.png'),
    templeId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('Invalid temple ID')),
    phoneNumber: Joi.string().pattern(/^\+\d{1,3}\d{8,}$/).required().error(new Error('Invalid phone number')),
}).required().options({ abortEarly: false });

//temple schema validations
const templeSchema = Joi.object({
    name: Joi.string().required().error(new Error('Temple name is required')),
    alternateName: Joi.string().optional(),
    location: Joi.string().required().error(new Error('Location is required')),
    image: Joi.string().uri().optional().default('https://png.pngtree.com/png-vector/20230207/ourmid/pngtree-om-logo-design-with-flower-mandala-png-image_6590267.png'),
    description: Joi.string().optional(),
    foundedYear: Joi.number().integer().optional(),
    historyImages: Joi.array().items(Joi.string().uri()).optional(),
    
    // godsAndGoddesses validation
    godsAndGoddesses: Joi.array().items(
        Joi.object({
            name: Joi.string().required().error(new Error('Username is required')),
            description: Joi.string().required().error(new Error('Short description is required')),
            image: Joi.string().uri().optional(),
        })
    ).optional(),
    
    // festivals validation
    festivals: Joi.array().items(
        Joi.object({
            festivalName: Joi.string().required().error(new Error('Festival name is required')),
            festivalImportance: Joi.string().optional(),
            festivalImages: Joi.array().items(Joi.string().uri()).optional(),
        })
    ).optional(),

    // pujari section validation
    pujaris: Joi.array().items(
        Joi.object({
            name: Joi.string().required().error(new Error('Pujari name is required')),
            profile: Joi.string().uri().optional(),
            experience: Joi.number().integer().min(0).optional().error(new Error('Experience should be a valid number')),
            designation: Joi.string().optional(),
            specialization: Joi.string().optional(),
            contactInfo: Joi.string().pattern(/^\d{10}$/).optional().error(new Error('Contact info must be a valid 10-digit number')),
        })
    ).optional(),

    // management section validation
    management: Joi.array().items(
        Joi.object({
            name: Joi.string().required().error(new Error('Person name is required')),
            role: Joi.string().required().error(new Error('Person role is required')),
            profile: Joi.string().uri().optional(),
        })
    ).optional(),
}).required().options({ abortEarly: false });

//user schema validations
const userSchema = Joi.object({
    username: Joi.string().required().error(new Error('Username is required')),
    email: Joi.string().email().required().error(new Error('Valid email is required')),
    password: Joi.string().required().error(new Error('Password is required')),
    profilePicture: Joi.string().default('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXNChij9NGxfXhZQeEwg0TG9WAK6vm4vVm-e0EncJcCQ&s'),
    isAdmin: Joi.boolean().default(false),
    templeId: Joi.string().required().error(new Error('Temple ID is required')),
    phoneNumber: Joi.string().pattern(/^\+\d{1,3}\d{8,}$/).required().error(new Error('Invalid phone number')),
    roles: Joi.array().items().error(new Error('Roles must be an array of strings'))
}).required().options({ abortEarly: false });

//expense schema validations
const expenseSchema = Joi.object({
    title: Joi.string().required().error(new Error('Title is required')),
    amount: Joi.number().required().error(new Error('Amount is required')),
    date: Joi.date().default(Date.now),
    category: Joi.string()
        .valid(
            'Rituals & Poojas',
            'Festivals & Events',
            'Maintenance & Repairs',
            'Utilities',
            'Staff Salaries',
            'Charity & Donations',
            'Food & Prasadam',
            'Decorations & Flowers',
            'Security',
            'Miscellaneous'
        ).required().error(new Error('Category is required')),
    status: Joi.string().valid('pending', 'approved', 'completed', 'rejected').default('pending'),
    templeId: Joi.string().required().error(new Error('Temple ID is required')),
    event: Joi.string().optional().allow(null).error(new Error('Invalid Event ID'))
}).options({ abortEarly: false });

//event shcema validations
const eventSchema = Joi.object({
    name : Joi.string().required().error(new Error('Name is required')),
    date : Joi.date().default(Date.now),
    location : Joi.string().required().error(new Error("Location is required")),
    status : Joi.string().valid('pending', 'completed').default('pending'),
    templeId : Joi.string().required().error(new Error('Temple ID is required'))
}).options({ abortEarly : false });

// Invitation validation schema
const invitationSchema = Joi.object({
    donorName: Joi.string().required().error(new Error('Donor Name is required')),
    passCode: Joi.string().required().error(new Error('PassCode is required')),
    invited: Joi.boolean().default(false),
    attended: Joi.boolean().default(false),
    temple: Joi.string().required().error(new Error('Temple ID is required')),
    event: Joi.string().required().error(new Error('Event ID is required'))
}).options({ abortEarly: false });

const inventorySchema = Joi.object({
    name: Joi.string().required().error(new Error('Name is required')),
    category: Joi.string().required().error(new Error('Category is required')),
    quantity: Joi.number().required().error(new Error('Quantity is required')),
    unit: Joi.string().required().error(new Error('Unit is required')),
    unitPrice: Joi.number().required().error(new Error('Unit Price is required')),
    totalPrice: Joi.number().required().error(new Error('Total Price is required')),
    templeId: Joi.string().required().error(new Error('Temple ID is required'))
}).options({ abortEarly: false });

const tenantSchema = Joi.object({
    name: Joi.string().required().error(new Error('Name is required')),
    contactInfo: Joi.string().length(10).required().error(new Error('Contact Info must be a 10-digit number')),
    email: Joi.string().email().allow('').optional().error(new Error('Please provide a valid email address')),
    address: Joi.string().required().error(new Error('Address is required')),
    pinCode: Joi.number().required().error(new Error('Pin Code is required')),
    status: Joi.string().valid('Active', 'Inactive').default('Active').error(new Error('Status must be either Active or Inactive')),
    templeId: Joi.string().required().error(new Error('Temple ID is required')),
}).options({ abortEarly: false });

const assetSchema = Joi.object({
    assetType: Joi.string().valid('Land', 'Building', 'Shop', 'Rental Property', 'Vehicle', 'Jewelry', 'Furniture', 'Equipment').required().messages({
        'any.required': 'Asset Type is required'
    }),
    name: Joi.string().required().messages({
        'any.required': 'Name is required'
    }),
    description: Joi.string().allow('').optional(),
    acquisitionDate: Joi.date().allow('').optional(),
    acquisitionCost: Joi.string().allow('').optional(),
    currentValue: Joi.string().allow('').optional(),
    address: Joi.string().required().error(new Error('Address is required')),
    pincode: Joi.number().required().error(new Error('Pin Code is required')),
    status: Joi.string().valid('Active', 'Under Maintenance', 'Inactive').default('Active'),
    templeId: Joi.string().required().error(new Error('Temple ID is required')),
    rentDetails: Joi.object({
        tenant: Joi.string().optional(),
        rentAmount: Joi.number().optional(),
        leaseStartDate: Joi.date().optional(),
        leaseEndDate: Joi.date().optional(),
        paymentStatus: Joi.string().valid('Paid', 'Pending', 'Overdue').optional().default('Pending')
    }).optional()
}).options({ abortEarly: false });

module.exports = {
    daanSchema,
    permissionSchema,
    roleSchema,
    superAdminSchema,
    templeSchema,
    userSchema,
    expenseSchema,
    eventSchema,
    invitationSchema,
    inventorySchema,
    tenantSchema,
    assetSchema,
}
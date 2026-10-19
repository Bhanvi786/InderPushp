"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Artwork = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ArtworkImageSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    alt: { type: String, default: '' },
    isMain: { type: Boolean, default: false },
}, { _id: false });
const ArtworkSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Artwork title is required'],
        trim: true,
    },
    description: {
        type: String,
        default: '',
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        default: 'Floral & Nature',
        index: true,
    },
    priceINR: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be positive'],
        default: 0,
    },
    mainImage: {
        type: ArtworkImageSchema,
        required: [true, 'Main artwork image is required'],
    },
    additionalImages: {
        type: [ArtworkImageSchema],
        default: [],
    },
    dimensions: {
        type: String,
        default: '',
        trim: true,
    },
    materials: {
        type: String,
        default: '',
        trim: true,
    },
    availability: {
        type: String,
        enum: ['In Stock', 'Made to Order', 'Sold', 'Enquiry Only'],
        default: 'In Stock',
        required: true,
    },
    stockQuantity: {
        type: Number,
        default: 1,
        min: 0,
    },
    estimatedProductionTime: {
        type: String,
        default: '',
        trim: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
        index: true,
    },
    isPublished: {
        type: Boolean,
        default: true,
        index: true,
    },
    displayOrder: {
        type: Number,
        default: 0,
        index: true,
    },
}, {
    timestamps: true,
});
// Index for efficient ordering and filtering
ArtworkSchema.index({ displayOrder: 1, createdAt: -1 });
exports.Artwork = mongoose_1.default.model('Artwork', ArtworkSchema);

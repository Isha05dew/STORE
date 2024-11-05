import Category from "../models/category.model.js"
import asyncHandler from "../middlewares/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.json({ error: "Name is required" });
            // throw new ApiError(400, "Name is required");
        }

        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            return res.json({ error: "Already exists" });
            // throw new ApiError(400, "Already exists")
        }

        const category = await new Category({ name }).save();

        res
            .status(200)
            .json(
                new ApiResponse(200, category, "Category created successfully")
            )

    } catch (error) {
        console.log(error);
        return res.status(400).json(error)
    }
})

const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body
        const { categoryId } = req.params

        const category = await Category.findOne({ _id: categoryId })
        if (!category) {
            return res.status(404).json({ error: "Category not found" })
        }

        category.name = name;

        const updatedCategory = await category.save();
        res
            .status(200)
            .json(new ApiResponse(200, updatedCategory, "category updated successfully"))

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }
})

const removeCategory = asyncHandler(async (req, res) => {
    try {
        const removed = await Category.findByIdAndDelete(req.params.categoryId)
        res.json(removed)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }
})

const listCategory = asyncHandler(async (req, res) => {
    try {
        const all = await Category.find({});
        res
            .status(200)
            .json(
                new ApiResponse(200, all, "All categories fetched successfully")
            )
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message)
    }
})

const readCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        res.status(200)
        .json(
            new ApiResponse(200, category, "category fetched successfully")
        )
    } catch (error) {
        console.log(error)
        return res.status(400).json(error.message)
    }
}) 

export {
    createCategory,
    updateCategory,
    removeCategory,
    listCategory,
    readCategory,
}
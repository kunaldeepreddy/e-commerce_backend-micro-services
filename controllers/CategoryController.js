const Category = require("../models/Category");
const Product = require("../models/Product");
const Constants = require("../constants");

module.exports = {
	postCategory: async (req, res) => {
		let data = req.body;
		if (
			!data.name ||
			// !data.level ||
			// (data.level > 1 && !data.parent) ||
			!data.tags
		) {
			return res.status(400).json({
				status: true,
				message: res.__("params_missing"),
			});
		}
		if (data.level < 0 || data.level > 3) {
			return res.status(400).json({
				status: true,
				message: res.__("invalid_request"),
			});
		}
		let new_data = {
			name: data.name,
			// level: data.level,
			tags: data.tags,
		};
		// if (data.level > 1) {
		// 	new_data.parent = data.parent;
			// let parent = await Category.findById(data.parent).lean();
			// if (!parent) {
			// 	return res.status(404).json({
			// 		status: true,
			// 		message: res.__("invalid_request"),
			// 	});
			// }
			// let parents = parent.ancestors;
			// parents.push(parent._id);
			// new_data.ancestors = parents;
		// }
		let record = await new Category(new_data).save();
		return res.json({
			status: true,
			message: res.__("added"),
			data: record,
		});
	},

	updateCategory: async (req, res) => {
		let data = req.body;
		if (
			!data.category_id ||
			!data.name ||
			// !data.level ||
			// (data.level > 1 && !data.parent) ||
			!data.tags
		) {
			return res.status(400).json({
				status: true,
				message: res.__("params_missing"),
			});
		}
		let category = await Category.findById(data.category_id).lean();
		if (!category) {
			return res.status(404).json({
				status: true,
				message: res.__("invalid_request"),
			});
		}
		// if (data.level > 1 && category.parent != data.parent) {
		// 	let parent = await Category.findById(data.parent).lean();
		// 	if (!parent) {
		// 		return res.status(404).json({
		// 			status: true,
		// 			message: res.__("invalid_request"),
		// 		});
		// 	}
		// 	let parents = category.ancestors.filter(
		// 		(parent) => parent != category.parent
		// 	);
		// 	parents.push(parent._id);
		// 	data.ancestors = parents;
		// }
		let record = await Category.findByIdAndUpdate(data.category_id, data, {
			new: true,
		});
		return res.json({
			status: true,
			message: res.__("updated"),
			data: record,
		});
	},

	updateCategoryStatus: async (req, res) => {
		let data = req.body;
		if (!data.category_id || data.is_active == undefined) {
			return res.status(400).json({
				status: true,
				message: res.__("params_missing"),
			});
		}
		let category = await Category.findById(data.category_id).lean();
		if (!category) {
			return res.status(404).json({
				status: true,
				message: res.__("invalid_request"),
			});
		}
		if (category.is_active != data.is_active) {
			await Category.findByIdAndUpdate(data.category_id, {
				is_active: data.is_active,
			});
			// await Category.updateMany(
			// 	{ ancestors: { $all: [data.category_id] } },
			// 	{ is_active: false }
			// );
			await Product.updateMany(
				{ ancestors: { $all: [data.category_id] } },
				{ is_active: data.is_active }
			);
		}
		return res.json({
			status: true,
			message: res.__("updated"),
		});
	},

	// getCategoriesByLevel: async (req, res) => {
	// 	let categories = await Category.find({}, "name level inserted_at")
	// 		.sort({ inserted_at: -1 })
	// 		.lean();
	// 	let result = {
	// 		level_1: [],
	// 		level_2: [],
	// 		level_3: [],
	// 	};
	// 	categories.forEach((category) => {
	// 		if (category.level == 1) result.level_1.push(category);
	// 		else if (category.level == 2) result.level_2.push(category);
	// 		else result.level_3.push(category);
	// 	});
	// 	return res.json({
	// 		status: true,
	// 		message: res.__("success"),
	// 		data: result,
	// 	});
	// },

	getAllCategories: async (req, res) => {
		let query = req.query.search;
		if (!query) query = "";
		let categories = await Category.find(
			{
				$or: [
					{ name: { $regex: query, $options: "i" } },
					{ tags: { $regex: query, $options: "i" } },
				],
			},
			" -ancestors -updated_at"
		)
			.populate("parent", "name level")
			.sort({ name: 1, level: 1 })
			.lean();
		return res.json({
			status: true,
			message: res.__("success"),
			data: categories,
		});
	},

	deleteCategory: async (req, res) => {
		let id = req.params.id;
		await Category.findByIdAndDelete(id);
		await Product.updateMany(
			{ ancestors: { $all: [id] } },
			{ is_active: false }
		);
		return res.json({
			status: true,
			message: res.__("deleted"),
		});
	},
};

import { searchAddress } from "../services/addressService.js";
import { cleanAddress } from "../util/parser.js";

export const parseAddress = async (req, res, next) => {
  try {
    const { address } = req.body;

    if (!address || typeof address !== "string" || !address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const cleaned = cleanAddress(address);
    const result = await searchAddress(cleaned);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No matching address found",
      });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

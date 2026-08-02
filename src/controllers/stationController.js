import { prisma } from "../config/db.js";

export const createStation = async (req, res) => {
  try {
    const {
      stationName,
      locationAddress,
      jurisdictionArea,
      contactNumber,
    } = req.body;

    const station = await prisma.station.create({
      data: {
        stationName,
        locationAddress,
        jurisdictionArea,
        contactNumber,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Station created successfully",
      data: station,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create station",
      error: error.message,
    });
  }
};

export const getAllStations = async (req, res) => {
  try {
    const stations = await prisma.station.findMany({
      include: {
        officers: true,
        cases: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: stations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch stations",
      error: error.message,
    });
  }
};

export const getStationById = async (req, res) => {
  try {
    const { id } = req.params;

    const station = await prisma.station.findUnique({
      where: {
        id,
      },
      include: {
        officers: true,
        cases: true,
      },
    });

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Station not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: station,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch station",
      error: error.message,
    });
  }
};

export const updateStation = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      stationName,
      locationAddress,
      jurisdictionArea,
      contactNumber,
    } = req.body;

    const existingStation = await prisma.station.findUnique({
      where: {
        id,
      },
    });

    if (!existingStation) {
      return res.status(404).json({
        success: false,
        message: "Station not found",
      });
    }

    const updatedStation = await prisma.station.update({
      where: {
        id,
      },
      data: {
        stationName,
        locationAddress,
        jurisdictionArea,
        contactNumber,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Station updated successfully",
      data: updatedStation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update station",
      error: error.message,
    });
  }
};

export const deleteStation = async (req, res) => {
  try {
    const { id } = req.params;

    const existingStation = await prisma.station.findUnique({
      where: {
        id,
      },
    });

    if (!existingStation) {
      return res.status(404).json({
        success: false,
        message: "Station not found",
      });
    }

    await prisma.station.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Station deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete station",
      error: error.message,
    });
  }
};
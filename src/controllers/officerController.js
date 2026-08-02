import { prisma } from "../config/db.js";

export const createOfficer = async (req, res) => {
  try {
    const {
      badgeNumber,
      firstName,
      lastName,
      gender,
      rankLevel,
      designation,
      contactNumber,
      stationId,
    } = req.body;

    const station = await prisma.station.findUnique({
      where: { id: stationId },
    });

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Station not found",
      });
    }

    const officer = await prisma.officer.create({
      data: {
        badgeNumber,
        firstName,
        lastName,
        gender,
        rankLevel,
        designation,
        contactNumber,
        stationId,
      },
      include: {
        station: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Officer created successfully",
      data: officer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create officer",
      error: error.message,
    });
  }
};

export const getAllOfficers = async (req, res) => {
  try {
    const officers = await prisma.officer.findMany({
      include: {
        station: true,
        evidence: true,
        arrests: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: officers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch officers",
      error: error.message,
    });
  }
};

export const getOfficerById = async (req, res) => {
  try {
    const { id } = req.params;

    const officer = await prisma.officer.findUnique({
      where: { id },
      include: {
        station: true,
        evidence: true,
        arrests: {
          include: {
            criminal: true,
            case: true,
          },
        },
        user: true,
      },
    });

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: officer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch officer",
      error: error.message,
    });
  }
};

export const updateOfficer = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      badgeNumber,
      firstName,
      lastName,
      gender,
      rankLevel,
      designation,
      contactNumber,
      stationId,
    } = req.body;

    const existingOfficer = await prisma.officer.findUnique({
      where: { id },
    });

    if (!existingOfficer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

    if (stationId) {
      const station = await prisma.station.findUnique({
        where: { id: stationId },
      });

      if (!station) {
        return res.status(404).json({
          success: false,
          message: "Station not found",
        });
      }
    }

    const updatedOfficer = await prisma.officer.update({
      where: { id },
      data: {
        badgeNumber,
        firstName,
        lastName,
        gender,
        rankLevel,
        designation,
        contactNumber,
        stationId,
      },
      include: {
        station: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Officer updated successfully",
      data: updatedOfficer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update officer",
      error: error.message,
    });
  }
};

export const deleteOfficer = async (req, res) => {
  try {
    const { id } = req.params;

    const existingOfficer = await prisma.officer.findUnique({
      where: { id },
    });

    if (!existingOfficer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

    await prisma.officer.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Officer deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete officer",
      error: error.message,
    });
  }
};
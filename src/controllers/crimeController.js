import { prisma } from "../config/db.js";

export const createCrime = async (req, res) => {
  try {
    const { crimeType, severityLevel, legalCodeRef } = req.body;

    const crime = await prisma.crime.create({
      data: {
        crimeType,
        severityLevel,
        legalCodeRef,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Crime created successfully",
      data: crime,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create crime",
      error: error.message,
    });
  }
};

export const getAllCrimes = async (req, res) => {
  try {
    const crimes = await prisma.crime.findMany({
      include: {
        criminalCases: {
          include: {
            criminal: true,
            case: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: crimes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch crimes",
      error: error.message,
    });
  }
};

export const getCrimeById = async (req, res) => {
  try {
    const { id } = req.params;

    const crime = await prisma.crime.findUnique({
      where: { id },
      include: {
        criminalCases: {
          include: {
            criminal: true,
            case: true,
          },
        },
      },
    });

    if (!crime) {
      return res.status(404).json({
        success: false,
        message: "Crime not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: crime,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch crime",
      error: error.message,
    });
  }
};

export const updateCrime = async (req, res) => {
  try {
    const { id } = req.params;
    const { crimeType, severityLevel, legalCodeRef } = req.body;

    const existingCrime = await prisma.crime.findUnique({
      where: { id },
    });

    if (!existingCrime) {
      return res.status(404).json({
        success: false,
        message: "Crime not found",
      });
    }

    const updatedCrime = await prisma.crime.update({
      where: { id },
      data: {
        crimeType,
        severityLevel,
        legalCodeRef,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Crime updated successfully",
      data: updatedCrime,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update crime",
      error: error.message,
    });
  }
};

export const deleteCrime = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCrime = await prisma.crime.findUnique({
      where: { id },
    });

    if (!existingCrime) {
      return res.status(404).json({
        success: false,
        message: "Crime not found",
      });
    }

    await prisma.crime.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Crime deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete crime",
      error: error.message,
    });
  }
};
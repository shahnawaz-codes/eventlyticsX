import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.js";

export const createProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { projectName } = req.body;
    if (!projectName) {
      return res
        .status(400)
        .json({ success: false, messege: "project name is required" });
    }
    const projectKey =
      "ev_x_" + Math.random().toString(36).slice(2) + Date.now();
      
  } catch (error) {
    console.log("something goes wrong");
  }
};
export const getProjects = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  // Return sample project list for the authenticated user
  res.status(200).json({
    success: true,
    user: {
      id: user?.id,
      email: user?.email,
    },
    projects: [
      {
        id: "proj_1",
        name: "My First Project",
        apiKey: "evt_key_prod_abcdefg12345",
        createdAt: new Date(),
      },
      {
        id: "proj_2",
        name: "eCommerce Store",
        apiKey: "evt_key_prod_zxywvut98765",
        createdAt: new Date(),
      },
    ],
  });
};

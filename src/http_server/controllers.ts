import { Request } from "express";
import storage from "../utils/store";

export function listServers(_: Request, res: any) {
  try {
    const data = storage.state;
    res.json({
      success: true,
      data,
      message: "Server list retrieved successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      data: {},
      message: "Error retrieving server list",
    });
  }
}

export function addServer(req: Request, res: any) {
  try {
    const { body } = req as { body: any };
    const newEntry = { [body.name]: { ip: body.ip, port: body.port } };
    storage.updateData((prev) => ({
      ...prev,
      ...newEntry,
    }));

    res.json({
      success: true,
      data: newEntry,
      message: "Server added successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      data: {},
      message: "Some Problem Occurred",
    });
  }
}

export function updateServers(req: Request, res: any) {
  try {
    const { id } = req.params;

    const { name, ip, port } = req.body as any;

    storage.updateData((prev) => {
      if (id in prev && id === name) {
        return {
          ...prev,
          [name]: { ip, port },
        };
      }

      return {
        ...prev,
        [name]: { ip, port },
        [id]: undefined,
      };
    });
    res.json({
      success: true,
      data: { result: id === name ? "updated" : "replaced" },
      message: "Server updated successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      data: {},
      message: "Some problem occurred while updating server",
    });
  }
}

export function deleteServer(req: Request, res: any) {
  try {
    const { id } = req.params;

    storage.updateData((prev) => ({ ...prev, [id]: undefined }));
    res.json({
      success: true,
      data: { id },
      message: "Server deleted successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      data: {},
      message: "Some problem occurred while deleting server",
    });
  }
}

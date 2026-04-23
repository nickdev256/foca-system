import AuditLog from "../models/AuditLog.js";

export const logAudit = async (actor, action, entity, entityId, metadata = {}) => {
  try {
    await AuditLog.create({ actor, action, entity, entityId, metadata });
  } catch (e) {
    console.error('Audit error', e.message);
  }
};

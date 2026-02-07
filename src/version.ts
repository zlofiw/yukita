// Single source of truth for the runtime/library version.
// This is intentionally a plain constant so it survives bundling.
export const CORE_VERSION = '0.1.0';

// Default plugin compatibility range for built-in plugins.
export const CORE_COMPATIBLE_RANGE = `^${CORE_VERSION}`;


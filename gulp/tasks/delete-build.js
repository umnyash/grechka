// Configuration
import paths from '../paths.js';

// Plugins
import { deleteAsync } from 'del';

export default function deleteBuild() {
  return deleteAsync(paths.root);
}

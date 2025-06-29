#!/usr/bin/env ts-node

import { generateAndSave } from '../lib/colors/generator';

// Run the color generation
generateAndSave().catch((error) => {
  console.error('❌ Failed to generate colors:', error);
  process.exit(1);
}); 
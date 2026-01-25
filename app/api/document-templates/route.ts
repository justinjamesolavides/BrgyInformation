import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the path to the data file
const DATA_FILE = path.join(process.cwd(), 'data', 'document-templates.json');

// Ensure the data directory exists and initialize with default data if needed
function ensureDataFileExists() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify([
        {
          id: 1,
          name: "Barangay Clearance Template",
          type: "clearance",
          status: "active",
          lastModified: "2024-01-15",
          content: "TO WHOM IT MAY CONCERN: This is to certify that [NAME] of legal age, [CIVIL STATUS], whose specimen signature appears hereon, is a bonafide resident of [ADDRESS]..."
        },
        {
          id: 2,
          name: "Cedula Template",
          type: "tax",
          status: "active",
          lastModified: "2024-01-10",
          content: "COMMUNITY TAX CERTIFICATE: This is to certify that [NAME], [AGE] years of age, [CIVIL STATUS], [PROFESSION/BUSINESS]..."
        },
        {
          id: 3,
          name: "Certificate of Residency",
          type: "certificate",
          status: "draft",
          lastModified: "2024-01-20",
          content: "CERTIFICATE OF RESIDENCY: This is to certify that [NAME] is a permanent resident of [BARANGAY NAME]..."
        }
      ], null, 2)
    );
  }
}

// Helper function to read templates from the JSON file
function readTemplatesFromFile(): any[] {
  ensureDataFileExists();
  const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(fileContent);
}

// Helper function to write templates to the JSON file
function writeTemplatesToFile(templates: any[]): void {
  ensureDataFileExists();
  fs.writeFileSync(DATA_FILE, JSON.stringify(templates, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const templates = readTemplatesFromFile();
    return new Response(JSON.stringify(templates), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching document templates:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch document templates' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const templates = readTemplatesFromFile();
    const newTemplate = await request.json();
    
    // Validate required fields
    if (!newTemplate.name || !newTemplate.content) {
      return new Response(
        JSON.stringify({ error: 'Template name and content are required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Generate a new ID
    const newId = templates.length > 0 ? Math.max(...templates.map(t => t.id)) + 1 : 1;
    
    const templateToAdd = {
      ...newTemplate,
      id: newId,
      status: newTemplate.status || 'draft',
      lastModified: new Date().toISOString().split('T')[0],
    };

    templates.push(templateToAdd);
    writeTemplatesToFile(templates);

    return new Response(JSON.stringify(templateToAdd), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error adding document template:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to add document template' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const templates = readTemplatesFromFile();
    const { id, ...updatedTemplate } = await request.json();

    const index = templates.findIndex(template => template.id === id);
    if (index === -1) {
      return new Response(
        JSON.stringify({ error: 'Template not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    templates[index] = {
      ...templates[index],
      ...updatedTemplate,
      id, // Ensure ID doesn't change
      lastModified: new Date().toISOString().split('T')[0],
    };

    writeTemplatesToFile(templates);

    return new Response(JSON.stringify(templates[index]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating document template:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update document template' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const templates = readTemplatesFromFile();
    const { id } = await request.json();

    const index = templates.findIndex(template => template.id === id);
    if (index === -1) {
      return new Response(
        JSON.stringify({ error: 'Template not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    templates.splice(index, 1);
    writeTemplatesToFile(templates);

    return new Response(
      JSON.stringify({ message: 'Template deleted successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error deleting document template:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete document template' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
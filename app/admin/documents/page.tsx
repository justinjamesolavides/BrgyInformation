"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFileAlt, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSpinner } from "react-icons/fa";

const DocumentTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<number | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    type: "clearance",
    content: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/document-templates');
        if (response.ok) {
          const data = await response.json();
          setTemplates(data);
        } else {
          console.error('Failed to fetch templates:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleEdit = (id: number) => {
    setEditingTemplate(id);
  };

  const handleSave = async (id: number) => {
    const templateElement = document.querySelector(`textarea[data-template-id="${id}"]`) as HTMLTextAreaElement;
    if (!templateElement) return;
    
    const updatedContent = templateElement.value;
    
    setSaving(true);
    try {
      const response = await fetch('/api/document-templates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          content: updatedContent
        }),
      });
      
      if (response.ok) {
        const updatedTemplate = await response.json();
        setTemplates(templates.map(t => t.id === id ? updatedTemplate : t));
        setEditingTemplate(null);
      } else {
        alert('Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('An error occurred while saving the template');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this template? This action cannot be undone.")) {
      setDeleting(id);
      try {
        const response = await fetch('/api/document-templates', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        
        if (response.ok) {
          setTemplates(templates.filter(t => t.id !== id));
        } else {
          alert('Failed to delete template');
        }
      } catch (error) {
        console.error('Error deleting template:', error);
        alert('An error occurred while deleting the template');
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleAddTemplate = async () => {
    if (newTemplate.name && newTemplate.content) {
      setSaving(true);
      try {
        const response = await fetch('/api/document-templates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTemplate),
        });
        
        if (response.ok) {
          const addedTemplate = await response.json();
          setTemplates([...templates, addedTemplate]);
          setNewTemplate({ name: "", type: "clearance", content: "" });
          setShowAddForm(false);
        } else {
          alert('Failed to add template');
        }
      } catch (error) {
        console.error('Error adding template:', error);
        alert('An error occurred while adding the template');
      } finally {
        setSaving(false);
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case "clearance": return "bg-blue-100 text-blue-800";
      case "tax": return "bg-green-100 text-green-800";
      case "certificate": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h1 className="text-2xl font-bold text-gray-900">Document Templates</h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="text-sm" />
            Add Template
          </button>
        </div>
        <p className="text-gray-600 mt-2">Manage document templates and formats</p>
      </motion.div>

      {/* Add Template Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-lg p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                placeholder="Enter template name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newTemplate.type}
                onChange={(e) => setNewTemplate({...newTemplate, type: e.target.value})}
              >
                <option value="clearance">Clearance</option>
                <option value="tax">Tax Document</option>
                <option value="certificate">Certificate</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Content *
            </label>
            <textarea
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={newTemplate.content}
              onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
              placeholder="Enter template content with placeholders like [NAME], [ADDRESS], etc."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddTemplate}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaSave className="text-sm" />
              Save Template
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewTemplate({ name: "", type: "clearance", content: "" });
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center gap-2"
            >
              <FaTimes className="text-sm" />
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Templates Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {templates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                    {template.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(template.status)}`}>
                    {template.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(template.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  disabled={saving}
                >
                  <FaEdit className="text-sm" />
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={deleting === template.id}
                >
                  {deleting === template.id ? <FaSpinner className="text-sm animate-spin" /> : <FaTrash className="text-sm" />}
                </button>
              </div>
            </div>

            {editingTemplate === template.id ? (
              <div className="space-y-4">
                <textarea
                  rows={4}
                  defaultValue={template.content}
                  data-template-id={template.id}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(template.id)}
                    className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                  >
                    <FaSave className="text-xs" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingTemplate(null)}
                    className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {template.content.substring(0, 150)}...
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  Last modified: {template.lastModified}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {templates.length === 0 && !showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FaFileAlt className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500">No templates found</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Template
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default DocumentTemplates;
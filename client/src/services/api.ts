import {
  User,
  Project,
  ProjectDetailResponse,
  Character,
  Scene,
  Storyboard,
  Voice,
  Asset,
  ExportRecord
} from '../types/index.ts';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('scenara_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  auth: {
    async login(email: string, password: string): Promise<{ token: string; user: User }> {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Login failed');
      }
      const data = await res.json();
      localStorage.setItem('scenara_token', data.token);
      return data;
    },

    async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Registration failed');
      }
      const data = await res.json();
      localStorage.setItem('scenara_token', data.token);
      return data;
    },

    async me(): Promise<{ user: User }> {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },

    logout() {
      localStorage.removeItem('scenara_token');
    }
  },

  // Projects
  projects: {
    async list(): Promise<{ projects: Project[] }> {
      const res = await fetch(`${API_BASE}/projects`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    },

    async get(id: string): Promise<ProjectDetailResponse> {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch project details');
      return res.json();
    },

    async createWizard(payload: {
      title?: string;
      idea: string;
      projectType: string;
      genre: string;
      targetDurationSeconds: number;
      aspectRatio: string;
      visualStyle: string;
      voiceStyle: string;
      musicStyle: string;
      language: string;
    }): Promise<{ success: boolean; projectId: string; plan: any }> {
      const res = await fetch(`${API_BASE}/projects/create-wizard`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'AI Director planning failed');
      }
      return res.json();
    },

    async update(id: string, updates: Partial<Project>): Promise<{ project: Project }> {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update project');
      return res.json();
    },

    async delete(id: string): Promise<{ success: boolean }> {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete project');
      return res.json();
    },

    async duplicate(id: string): Promise<{ success: boolean; duplicatedProjectId: string }> {
      const res = await fetch(`${API_BASE}/projects/${id}/duplicate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to duplicate project');
      return res.json();
    },

    async repurpose(id: string, options: { targetFormat: string; targetDuration: number; repurposeType: string }): Promise<{ success: boolean; repurposedProjectId: string }> {
      const res = await fetch(`${API_BASE}/projects/${id}/repurpose`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(options),
      });
      if (!res.ok) throw new Error('Failed to repurpose project');
      return res.json();
    }
  },

  // Scripts
  scripts: {
    async get(projectId: string) {
      const res = await fetch(`${API_BASE}/scripts/${projectId}`, { headers: getAuthHeaders() });
      return res.json();
    },
    async update(projectId: string, content: string, title?: string) {
      const res = await fetch(`${API_BASE}/scripts/${projectId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content, title }),
      });
      return res.json();
    },
    async aiAssistant(projectId: string, action: string, instruction?: string) {
      const res = await fetch(`${API_BASE}/scripts/${projectId}/ai-assistant`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action, instruction }),
      });
      return res.json();
    }
  },

  // Characters
  characters: {
    async list(projectId: string): Promise<{ characters: Character[] }> {
      const res = await fetch(`${API_BASE}/characters/${projectId}`, { headers: getAuthHeaders() });
      return res.json();
    },
    async create(projectId: string, charData: Partial<Character>) {
      const res = await fetch(`${API_BASE}/characters/${projectId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(charData),
      });
      return res.json();
    },
    async update(id: string, charData: Partial<Character>) {
      const res = await fetch(`${API_BASE}/characters/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(charData),
      });
      return res.json();
    },
    async delete(id: string) {
      const res = await fetch(`${API_BASE}/characters/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.json();
    },
    async generateProfile(role: string, genre: string, descriptionHint?: string) {
      const res = await fetch(`${API_BASE}/characters/generate-profile`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role, genre, descriptionHint }),
      });
      return res.json();
    }
  },

  // Scenes
  scenes: {
    async list(projectId: string): Promise<{ scenes: Scene[] }> {
      const res = await fetch(`${API_BASE}/scenes/${projectId}`, { headers: getAuthHeaders() });
      return res.json();
    },
    async update(id: string, updates: Partial<Scene>): Promise<{ scene: Scene }> {
      const res = await fetch(`${API_BASE}/scenes/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      return res.json();
    },
    async create(projectId: string, sceneData: Partial<Scene>): Promise<{ scene: Scene }> {
      const res = await fetch(`${API_BASE}/scenes/${projectId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(sceneData),
      });
      return res.json();
    },
    async delete(id: string) {
      const res = await fetch(`${API_BASE}/scenes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.json();
    },
    async regenerate(id: string, prompt?: string) {
      const res = await fetch(`${API_BASE}/scenes/${id}/regenerate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ prompt }),
      });
      return res.json();
    },
    async selectVersion(id: string, versionId: string) {
      const res = await fetch(`${API_BASE}/scenes/${id}/versions/${versionId}/select`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return res.json();
    },
    async evaluate(id: string) {
      const res = await fetch(`${API_BASE}/scenes/${id}/evaluate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return res.json();
    }
  },

  // Storyboards
  storyboards: {
    async list(projectId: string): Promise<{ storyboards: Storyboard[] }> {
      const res = await fetch(`${API_BASE}/storyboards/${projectId}`, { headers: getAuthHeaders() });
      return res.json();
    },
    async regenerate(sceneId: string) {
      const res = await fetch(`${API_BASE}/storyboards/${sceneId}/regenerate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return res.json();
    }
  },

  // Voices
  voices: {
    async list(): Promise<{ voices: Voice[] }> {
      const res = await fetch(`${API_BASE}/voices`, { headers: getAuthHeaders() });
      return res.json();
    },
    async generate(text: string, voiceId?: string) {
      const res = await fetch(`${API_BASE}/voices/generate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text, voiceId }),
      });
      return res.json();
    }
  },

  // Audio Library
  audio: {
    async library() {
      const res = await fetch(`${API_BASE}/audio/library`, { headers: getAuthHeaders() });
      return res.json();
    }
  },

  // Assets
  assets: {
    async list(): Promise<{ assets: Asset[] }> {
      const res = await fetch(`${API_BASE}/assets`, { headers: getAuthHeaders() });
      return res.json();
    },
    async upload(file: File, projectId?: string) {
      const formData = new FormData();
      formData.append('file', file);
      if (projectId) formData.append('projectId', projectId);

      const token = localStorage.getItem('scenara_token');
      const res = await fetch(`${API_BASE}/assets/upload`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });
      return res.json();
    },
    async delete(id: string) {
      const res = await fetch(`${API_BASE}/assets/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.json();
    }
  },

  // Generation Jobs
  generation: {
    async createJob(projectId: string, sceneId?: string, jobType = 'video') {
      const res = await fetch(`${API_BASE}/generation/job`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ projectId, sceneId, jobType }),
      });
      return res.json();
    },
    async getJob(id: string) {
      const res = await fetch(`${API_BASE}/generation/job/${id}`, { headers: getAuthHeaders() });
      return res.json();
    }
  },

  // Exports
  exports: {
    async render(projectId: string, options?: { resolution?: string; aspectRatio?: string; format?: string }): Promise<{ export: ExportRecord }> {
      const res = await fetch(`${API_BASE}/exports/render`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ projectId, ...options }),
      });
      if (!res.ok) throw new Error('Render export failed');
      return res.json();
    },
    async list(projectId: string): Promise<{ exports: ExportRecord[] }> {
      const res = await fetch(`${API_BASE}/exports/${projectId}`, { headers: getAuthHeaders() });
      return res.json();
    }
  },

  // Usage
  usage: {
    async get() {
      const res = await fetch(`${API_BASE}/usage`, { headers: getAuthHeaders() });
      return res.json();
    }
  }
};

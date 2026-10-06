import React, { useState, useEffect } from 'react';
import { User, Project } from './types/index.ts';
import { api } from './services/api.ts';

// Components
import { Navbar } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { MobileNav } from './components/MobileNav.tsx';

// Pages
import { LandingPage } from './pages/LandingPage.tsx';
import { AuthPage } from './pages/AuthPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { CreateWizardPage } from './pages/CreateWizardPage.tsx';
import { ProjectWorkspacePage } from './pages/ProjectWorkspacePage.tsx';
import { TemplatesPage } from './pages/TemplatesPage.tsx';
import { AssetLibraryPage } from './pages/AssetLibraryPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { CharactersPage } from './pages/CharactersPage.tsx';
import { VoicesPage } from './pages/VoicesPage.tsx';
import { AudioStudioPage } from './pages/AudioStudioPage.tsx';
import { ExportsPage } from './pages/ExportsPage.tsx';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Initial authentication & session check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.auth.me();
        setUser(res.user);
      } catch {
        // If not logged in, user can browse landing page or use demo
      } finally {
        setIsLoadingAuth(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch projects when user is authenticated
  const loadProjects = async () => {
    try {
      const data = await api.projects.list();
      setProjects(data.projects);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  // Actions
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage('dashboard');
    loadProjects();
  };

  const handleLogout = () => {
    api.auth.logout();
    setUser(null);
    setCurrentPage('landing');
  };

  const handleOpenProject = (id: string) => {
    setActiveProjectId(id);
    setCurrentPage('workspace');
  };

  const handleExploreDemo = () => {
    // If not authenticated, authenticate with demo account
    if (!user) {
      setUser({
        id: 'user-admin-default',
        name: 'Sutradara Kreatif',
        email: 'admin@scenara.ai',
        plan: 'pro_studio',
        credits: 1500,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      });
    }
    setActiveProjectId('demo-last-chance-project');
    setCurrentPage('workspace');
  };

  const handleDuplicateProject = async (id: string) => {
    try {
      const res = await api.projects.duplicate(id);
      await loadProjects();
      setActiveProjectId(res.duplicatedProjectId);
      setCurrentPage('workspace');
    } catch (err: any) {
      alert(err.message || 'Duplikasi proyek gagal.');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus proyek film ini?')) return;
    try {
      await api.projects.delete(id);
      await loadProjects();
    } catch (err: any) {
      alert(err.message || 'Penghapusan proyek gagal.');
    }
  };

  // Render Landing Page
  if (currentPage === 'landing') {
    return (
      <LandingPage
        onStart={() => {
          if (user) {
            setCurrentPage('dashboard');
          } else {
            setCurrentPage('auth');
          }
        }}
        onExploreDemo={handleExploreDemo}
        onLogin={() => setCurrentPage('auth')}
      />
    );
  }

  // Render Auth Page
  if (currentPage === 'auth') {
    return (
      <AuthPage
        onSuccess={handleLoginSuccess}
        onBackToHome={() => setCurrentPage('landing')}
      />
    );
  }

  // Render Full Screen Project Workspace (Section 64 & 66)
  if (currentPage === 'workspace') {
    return (
      <ProjectWorkspacePage
        projectId={activeProjectId || 'demo-last-chance-project'}
        onBackToDashboard={() => {
          setCurrentPage('dashboard');
          loadProjects();
        }}
      />
    );
  }

  // Render Create Project Wizard (Section 12)
  if (currentPage === 'create') {
    return (
      <CreateWizardPage
        onProjectCreated={(newId) => {
          loadProjects();
          setActiveProjectId(newId);
          setCurrentPage('workspace');
        }}
        onCancel={() => setCurrentPage('dashboard')}
      />
    );
  }

  // Render Studio Shell (Navbar + Sidebar + View)
  return (
    <div className="min-h-screen bg-studio-950 text-white flex flex-col">
      <Navbar
        user={user}
        currentPage={currentPage}
        onNavigate={page => setCurrentPage(page)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex pb-16 lg:pb-0">
        <Sidebar
          currentPage={currentPage}
          onNavigate={page => setCurrentPage(page)}
        />

        <main className="flex-1 overflow-x-hidden">
          {(currentPage === 'dashboard' || currentPage === 'projects') && (
            <DashboardPage
              user={user}
              projects={projects}
              onOpenProject={handleOpenProject}
              onCreateProject={() => setCurrentPage('create')}
              onDuplicateProject={handleDuplicateProject}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {currentPage === 'characters' && (
            <CharactersPage />
          )}

          {currentPage === 'voices' && (
            <VoicesPage />
          )}

          {currentPage === 'audio' && (
            <AudioStudioPage />
          )}

          {currentPage === 'templates' && (
            <TemplatesPage
              onUseTemplate={() => setCurrentPage('create')}
            />
          )}

          {currentPage === 'assets' && (
            <AssetLibraryPage />
          )}

          {currentPage === 'exports' && (
            <ExportsPage />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              user={user}
            />
          )}
        </main>
      </div>

      {/* Mobile Responsive Navigation (Section 35) */}
      <MobileNav
        currentPage={currentPage}
        onNavigate={page => setCurrentPage(page)}
      />
    </div>
  );
};

export default App;

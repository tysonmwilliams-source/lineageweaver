/**
 * Home.jsx - Reimagined Home Page
 * 
 * PURPOSE:
 * The landing page for LineageWeaver, featuring an animated hero,
 * statistics dashboard, quick actions, recent activity, and navigation
 * to the four major systems.
 * 
 * ARCHITECTURE:
 * - Uses modular components from /components/home/
 * - Feature flags allow toggling sections on/off for testing
 * - Adapts to empty vs populated data states
 * - Respects theme system
 * 
 * FEATURES:
 * - Animated hero with illuminated initial letter
 * - Count-up statistics dashboard
 * - Quick action buttons
 * - Recent activity feed (or onboarding for empty state)
 * - Four major system navigation cards
 * - Dev panel for testing feature toggles
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import { useGenealogy } from '../contexts/GenealogyContext';
import { getAllEntries } from '../services/codexService';
import { getAllHeraldry } from '../services/heraldryService';

// Import home page components
import {
  DevFeaturePanel,
  HeroSection,
  StatsGlance,
  QuickActions,
  RecentActivity,
  SystemCard,
  loadFeatures
} from '../components/home';

import './Home.css';

/**
 * Home Page Component
 */
export default function Home() {
  // ==================== STATE ====================
  
  // Feature flags for toggling sections
  const [features, setFeatures] = useState(loadFeatures);
  
  // Additional data not in GenealogyContext
  const [codexEntries, setCodexEntries] = useState([]);
  const [heraldryCount, setHeraldryCount] = useState(0);
  const [isLoadingExtra, setIsLoadingExtra] = useState(true);
  
  // Get core data from context
  const { people, houses, relationships, loading: coreLoading } = useGenealogy();
  
  // ==================== DATA LOADING ====================
  
  // Load codex and heraldry data (not in GenealogyContext)
  useEffect(() => {
    let cancelled = false;
    
    async function loadExtraData() {
      try {
        setIsLoadingExtra(true);
        
        const [entries, heraldry] = await Promise.all([
          getAllEntries(),
          getAllHeraldry()
        ]);
        
        // Only update state if component is still mounted
        if (!cancelled) {
          setCodexEntries(entries || []);
          setHeraldryCount(heraldry?.length || 0);
        }
      } catch (error) {
        if (!cancelled && import.meta.env.DEV) {
          console.error('Error loading extra data for home page:', error);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingExtra(false);
        }
      }
    }
    
    loadExtraData();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => { cancelled = true; };
  }, []);
  
  // ==================== COMPUTED VALUES ====================
  
  // Statistics for the dashboard
  const stats = useMemo(() => ({
    people: people.length,
    houses: houses.length,
    relationships: relationships.length,
    codexEntries: codexEntries.length,
    heraldry: heraldryCount
  }), [people.length, houses.length, relationships.length, codexEntries.length, heraldryCount]);
  
  // Whether user has any data at all
  const hasData = stats.people > 0 || stats.houses > 0;
  
  // Loading state
  const isLoading = coreLoading || isLoadingExtra;
  
  // ==================== SYSTEM CARDS CONFIG ====================
  
  // Using Lucide icon names instead of emojis
  const systemCards = [
    {
      iconName: 'tree-deciduous',
      title: 'Family Tree',
      subtitle: 'Visualize lineages with interactive genealogy trees',
      path: '/tree',
      accentColor: 'accent-tree',
      delay: 0
    },
    {
      iconName: 'book-open',
      title: 'The Codex',
      subtitle: 'Wiki-style encyclopedia for your world\'s lore',
      path: '/codex',
      accentColor: 'accent-codex',
      delay: 0.1
    },
    {
      iconName: 'shield',
      title: 'The Armory',
      subtitle: 'Design heraldic arms and coats of arms',
      path: '/heraldry',
      accentColor: 'accent-armory',
      delay: 0.2
    },
    {
      iconName: 'anvil',
      title: 'Data Forge',
      subtitle: 'Manage people, houses, and relationships',
      path: '/manage',
      accentColor: 'accent-forge',
      delay: 0.3
    }
  ];
  
  // ==================== RENDER ====================
  
  return (
    <>
      <Navigation />
      
      <div className="home-page">
        <div className="home-container">
          <motion.div 
            className="home-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero Section */}
            <HeroSection features={features} />
            
            {/* Stats Dashboard */}
            {!isLoading && (
              <StatsGlance features={features} stats={stats} />
            )}
            
            {/* Quick Actions */}
            <QuickActions features={features} />
            
            {/* Recent Activity / Onboarding */}
            {!isLoading && (
              <RecentActivity 
                features={features}
                people={people}
                houses={houses}
                codexEntries={codexEntries}
                hasData={hasData}
              />
            )}
            
            {/* The Four Pillars - System Navigation */}
            <section className="systems-section">
              <motion.h2 
                className="systems-title"
                initial={features.staggeredEntrance ? { opacity: 0, y: -10 } : false}
                animate={features.staggeredEntrance ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.4 }}
              >
                The Four Pillars
              </motion.h2>
              
              <div className="systems-grid">
                {systemCards.map((card) => (
                  <SystemCard
                    key={card.path}
                    iconName={card.iconName}
                    title={card.title}
                    subtitle={card.subtitle}
                    path={card.path}
                    accentColor={card.accentColor}
                    delay={card.delay}
                    features={features}
                  />
                ))}
              </div>
            </section>
            
            {/* Footer */}
            <footer className="home-footer">
              <p>Built for worldbuilders, writers, and game masters</p>
            </footer>
          </motion.div>
        </div>
      </div>
      
      {/* Dev Feature Toggle Panel */}
      <DevFeaturePanel 
        features={features} 
        setFeatures={setFeatures}
      />
    </>
  );
}

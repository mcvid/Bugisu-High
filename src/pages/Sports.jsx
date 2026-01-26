import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, MapPin, Users, Trophy, ChevronRight, Hash, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Sports.css';

const Sports = () => {
    const [teams, setTeams] = useState([]);
    const [matches, setMatches] = useState([]);
    const [upcomingMatch, setUpcomingMatch] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [roster, setRoster] = useState([]);
    const [loadingRoster, setLoadingRoster] = useState(false);

    useEffect(() => {
        fetchSportsData();
    }, []);

    const fetchSportsData = async () => {
        // Fetch Teams
        const { data: teamsData } = await supabase
            .from('sports_teams')
            .select('*')
            .order('name');
        setTeams(teamsData || []);

        // Fetch Matches
        const { data: matchesData } = await supabase
            .from('matches')
            .select('*, sports_teams(name, sport)')
            .order('match_date', { ascending: false }); // Get recent first

        if (matchesData) {
            setMatches(matchesData);
            // Find next upcoming match
            const future = matchesData
                .filter(m => new Date(m.match_date) > new Date() && m.status === 'scheduled')
                .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))[0];
            setUpcomingMatch(future);
        }
    };

    const handleTeamClick = async (team) => {
        setSelectedTeam(team);
        setLoadingRoster(true);
        const { data } = await supabase
            .from('team_members')
            .select('*')
            .eq('team_id', team.id)
            .order('name');
        setRoster(data || []);
        setLoadingRoster(false);
    };

    return (
        <div className="sports-page">
            {/* Hero Section */}
            <div className="sports-hero">
                <div className="overlay"></div>
                <div className="hero-content container">
                    <span className="hero-badge"><Trophy size={16} /> Bugisu High Sports</span>
                    <h1>Champions in the Making</h1>
                    <p>Experience the passion, dedication, and spirit of our student athletes.</p>
                </div>
            </div>

            <div className="container main-content">

                {/* Match Center - Helper Function */}
                <div className="match-center-grid">
                    <div className="next-match-card">
                        <h3>Match Center</h3>
                        {upcomingMatch ? (
                            <div className="match-preview">
                                <div className="match-meta">
                                    <span className="sport-tag">{upcomingMatch.sports_teams?.sport}</span>
                                    <span className="match-date">
                                        {new Date(upcomingMatch.match_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </span>
                                </div>
                                <div className="teams-display">
                                    <div className="team-home">
                                        <div className="team-logo-placeholder">BHS</div>
                                        <span className="team-name">{upcomingMatch.sports_teams?.name}</span>
                                    </div>
                                    <div className="vs-badge">VS</div>
                                    <div className="team-away">
                                        <div className="team-logo-placeholder opponent">{upcomingMatch.opponent.charAt(0)}</div>
                                        <span className="team-name">{upcomingMatch.opponent}</span>
                                    </div>
                                </div>
                                <div className="match-location">
                                    <MapPin size={16} /> {upcomingMatch.location || 'Home Ground'}
                                    <span className="time-separator">•</span>
                                    <Calendar size={16} /> {new Date(upcomingMatch.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ) : (
                            <div className="no-match">
                                <p>No scheduled matches available.</p>
                            </div>
                        )}
                    </div>

                    <div className="latest-results-card">
                        <h3>Latest Results</h3>
                        <div className="results-list">
                            {matches.filter(m => m.status === 'completed' || m.home_score !== null).slice(0, 4).map(match => (
                                <div key={match.id} className="result-item">
                                    <div className="result-info">
                                        <span className="sport-sm">{match.sports_teams?.sport}</span>
                                        <span className="date-sm">{new Date(match.match_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="result-score">
                                        <span>{match.sports_teams?.name}</span>
                                        <span className="score-badge">
                                            {match.home_score} - {match.away_score}
                                        </span>
                                        <span>{match.opponent}</span>
                                    </div>
                                </div>
                            ))}
                            {matches.filter(m => m.status === 'completed').length === 0 && (
                                <p className="text-muted">No recent results.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Teams Section */}
                <div className="teams-section section">
                    <div className="section-header">
                        <h2>Our Teams</h2>
                        <p>Meet the athletes representing Bugisu High School.</p>
                    </div>

                    <div className="teams-grid">
                        {teams.map(team => (
                            <div key={team.id} className="team-card-public" onClick={() => handleTeamClick(team)}>
                                <div className="card-image-wrapper">
                                    {team.image_url ? (
                                        <img src={team.image_url} alt={team.name} />
                                    ) : (
                                        <div className="placeholder-team-img">
                                            <Users size={48} opacity={0.5} />
                                        </div>
                                    )}
                                    <div className="sport-overlay">{team.sport}</div>
                                </div>
                                <div className="card-content">
                                    <h3>{team.name}</h3>
                                    <p className="coach">Coach: {team.coach_name || 'TBA'}</p>
                                    <div className="card-footer">
                                        <span className="view-roster">View Roster <ChevronRight size={16} /></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Roster Modal */}
            {selectedTeam && (
                <div className="modal-overlay" onClick={() => setSelectedTeam(null)}>
                    <div className="modal-content roster-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedTeam(null)}><X size={24} /></button>

                        <div className="roster-header">
                            <h2>{selectedTeam.name}</h2>
                            <span className="badge">{selectedTeam.sport}</span>
                        </div>

                        <p className="team-desc">{selectedTeam.description || 'No description available for this team.'}</p>

                        <h3>Team Roster</h3>
                        {loadingRoster ? (
                            <div className="loading-spinner">Loading players...</div>
                        ) : roster.length > 0 ? (
                            <div className="roster-list">
                                {roster.map(player => (
                                    <div key={player.id} className="player-card">
                                        <div className="player-avatar">
                                            {player.photo_url ? (
                                                <img src={player.photo_url} alt={player.name} />
                                            ) : (
                                                <div className="avatar-placeholder">{player.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div className="player-info">
                                            <h4>{player.name}</h4>
                                            <span className="position">{player.position || 'Player'}</span>
                                        </div>
                                        {player.jersey_number && (
                                            <div className="jersey-number">
                                                <Hash size={12} /> {player.jersey_number}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted">No players listed in roster yet.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sports;

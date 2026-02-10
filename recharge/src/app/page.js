"use client";

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import PlanCard from '@/components/PlanCard';
import FilterPanel from '@/components/FilterPanel';

const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), { ssr: false });

const OTT_SERVICES = new Set([
    'Netflix', 'JioHotstar', 'Amazon Prime Video',
    'SonyLIV', 'ZEE5', 'FanCode',
    'Airtel Xstream Play', 'Xstream Premium',
    'JioTV', 'JioCloud', 'JioSaavn Pro',
    'Apple Music', 'Perplexity Pro', 'Google One',
    'Vi Movies & TV', 'Eros Now', 'Hungama',
    'Binge All Night'
]);

const UNWANTED_BENEFITS = new Set([
    'JioCinema',
    'Unlimited 4G Data',
    'Truly Unlimited Data'
]);

const initialFilterState = {
    operator: [], validity: [], data_per_day: [],
    unlimited_5g: false, ott_benefits: [], other_benefits: [],
    search: ''
};

const normalizePlanData = (plans) => {
    return plans.map(plan => {
        const standardizedBenefits = plan.additional_benefits.map(benefit => {
            const lower = benefit.toLowerCase();
            if (lower.includes('hotstar')) return 'JioHotstar';
            if (lower.includes('amazon prime')) return 'Amazon Prime Video';
            if (lower.includes('xstream play')) return 'Airtel Xstream Play';
            if (lower.includes('xstream premium')) return 'Xstream Premium';
            if (lower.includes('netflix')) return 'Netflix';
            if (lower.includes('sonyliv')) return 'SonyLIV';
            if (lower.includes('zee5')) return 'ZEE5';
            if (lower.includes('eros now')) return 'Eros Now';
            return benefit;
        });

        const cleanedBenefits = standardizedBenefits.filter(b => !UNWANTED_BENEFITS.has(b));
        return { ...plan, additional_benefits: [...new Set(cleanedBenefits)] };
    });
};

export default function HomePage() {
    const [allPlans, setAllPlans] = useState([]);
    const [activeFilters, setActiveFilters] = useState(initialFilterState);
    const [sortConfig, setSortConfig] = useState({ key: 'cost_per_day', direction: 'ascending' });

    useEffect(() => {
        fetch('/plans.json')
            .then(res => res.json())
            .then(raw_data => setAllPlans(normalizePlanData(raw_data)))
            .catch(error => console.error("Failed to load plans:", error));
    }, []);

    const filteredAndSortedPlans = useMemo(() => {
        let filtered = [...allPlans];

        if (activeFilters.search) {
            const q = activeFilters.search.toLowerCase();
            filtered = filtered.filter(plan =>
                plan.operator.toLowerCase().includes(q) ||
                plan.plan_name.toLowerCase().includes(q) ||
                plan.data.display_text.toLowerCase().includes(q) ||
                plan.additional_benefits.some(b => b.toLowerCase().includes(q)) ||
                String(plan.price).includes(q)
            );
        }
        if (activeFilters.unlimited_5g) {
            filtered = filtered.filter(plan => plan.additional_benefits.includes("Unlimited 5G Data"));
        }
        if (activeFilters.operator.length) {
            filtered = filtered.filter(plan => activeFilters.operator.includes(plan.operator));
        }
        if (activeFilters.validity.length) {
            filtered = filtered.filter(plan => activeFilters.validity.some(range => {
                if (range === '<30') return plan.validity_days < 30;
                if (range === '30-89') return plan.validity_days >= 30 && plan.validity_days <= 89;
                if (range === '>=90') return plan.validity_days >= 90;
                return false;
            }));
        }
        if (activeFilters.data_per_day.length) {
            filtered = filtered.filter(plan =>
                (plan.data.type === 'daily' || plan.data.type === 'daily_plus_lumpsum') &&
                activeFilters.data_per_day.includes(String(plan.data.limit_gb))
            );
        }
        if (activeFilters.ott_benefits.length) {
            filtered = filtered.filter(plan => activeFilters.ott_benefits.every(b => plan.additional_benefits.includes(b)));
        }
        if (activeFilters.other_benefits.length) {
            filtered = filtered.filter(plan => activeFilters.other_benefits.every(b => plan.additional_benefits.includes(b)));
        }

        filtered.sort((a, b) => {
            let valA = a[sortConfig.key], valB = b[sortConfig.key];
            if (sortConfig.key === 'cost_per_gb') {
                valA = valA ?? 9999; valB = valB ?? 9999;
            }
            const dir = sortConfig.direction === 'ascending' ? 1 : -1;
            if (valA < valB) return -1 * dir;
            if (valA > valB) return 1 * dir;
            return 0;
        });

        return filtered;
    }, [allPlans, activeFilters, sortConfig]);

    // Best-value detection
    const bestValues = useMemo(() => {
        if (filteredAndSortedPlans.length === 0) return { bestCostPerDay: null, bestCostPerGb: null };
        const withData = filteredAndSortedPlans.filter(p => p.cost_per_gb !== null);
        return {
            bestCostPerDay: filteredAndSortedPlans.reduce((best, p) => p.cost_per_day < best.cost_per_day ? p : best),
            bestCostPerGb: withData.length > 0 ? withData.reduce((best, p) => p.cost_per_gb < best.cost_per_gb ? p : best) : null
        };
    }, [filteredAndSortedPlans]);

    const handleFilterChange = (type, value, isChecked) => {
        setActiveFilters(prev => {
            if (type === 'unlimited_5g') return { ...prev, unlimited_5g: isChecked };
            if (type === 'search') return { ...prev, search: value };
            const newFilterGroup = isChecked ? [...prev[type], value] : prev[type].filter(item => item !== value);
            return { ...prev, [type]: newFilterGroup };
        });
    };

    const handleSortChange = (key) => {
        setSortConfig(prev => {
            if (prev.key === key) {
                return { key, direction: prev.direction === 'ascending' ? 'descending' : 'ascending' };
            }
            return { key, direction: 'ascending' };
        });
    };

    const handleResetFilters = () => { setActiveFilters(initialFilterState); };

    const { ottBenefitOptions, otherBenefitOptions } = useMemo(() => {
        const allBenefits = new Set(allPlans.flatMap(p => p.additional_benefits));
        allBenefits.delete("Unlimited 5G Data");
        const otts = [], others = [];
        allBenefits.forEach(benefit => {
            if (OTT_SERVICES.has(benefit)) otts.push(benefit);
            else others.push(benefit);
        });
        return { ottBenefitOptions: [...new Set(otts)].sort(), otherBenefitOptions: [...new Set(others)].sort() };
    }, [allPlans]);

    const sortArrow = (key) => {
        if (sortConfig.key !== key) return '';
        return sortConfig.direction === 'ascending' ? ' \u2191' : ' \u2193';
    };

    return (
        <>
            <header>
                <h1>Telecom Mileage</h1>
                <p>Find value-for-money recharge plans</p>
                <ThemeToggle />
            </header>
            <div className="main-content">
                <FilterPanel
                    ottBenefitOptions={ottBenefitOptions}
                    otherBenefitOptions={otherBenefitOptions}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilters}
                />
                <main>
                    <div className="controls">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search plans..."
                            value={activeFilters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value, true)}
                        />
                        <span className="plan-count">
                            {filteredAndSortedPlans.length} of {allPlans.length} plans
                        </span>
                        <span className="sort-label">Sort:</span>
                        <button onClick={() => handleSortChange('price')} className={sortConfig.key === 'price' ? 'active' : ''}>Price{sortArrow('price')}</button>
                        <button onClick={() => handleSortChange('validity_days')} className={sortConfig.key === 'validity_days' ? 'active' : ''}>Validity{sortArrow('validity_days')}</button>
                        <button onClick={() => handleSortChange('cost_per_day')} className={sortConfig.key === 'cost_per_day' ? 'active' : ''}>Cost/Day{sortArrow('cost_per_day')}</button>
                        <button onClick={() => handleSortChange('cost_per_gb')} className={sortConfig.key === 'cost_per_gb' ? 'active' : ''}>Cost/GB{sortArrow('cost_per_gb')}</button>
                    </div>
                    <div className="plans-container">
                        {filteredAndSortedPlans.length > 0
                            ? filteredAndSortedPlans.map(plan => {
                                const isBestCostPerDay = bestValues.bestCostPerDay && plan.operator === bestValues.bestCostPerDay.operator && plan.price === bestValues.bestCostPerDay.price && plan.validity_days === bestValues.bestCostPerDay.validity_days;
                                const isBestCostPerGb = bestValues.bestCostPerGb && plan.operator === bestValues.bestCostPerGb.operator && plan.price === bestValues.bestCostPerGb.price && plan.validity_days === bestValues.bestCostPerGb.validity_days;
                                return <PlanCard
                                    key={`${plan.operator}-${plan.price}-${plan.validity_days}`}
                                    plan={plan}
                                    badges={[
                                        ...(isBestCostPerDay ? ['Best Cost/Day'] : []),
                                        ...(isBestCostPerGb ? ['Best Cost/GB'] : [])
                                    ]}
                                />;
                            })
                            : <p className="no-results">No plans match the selected filters.</p>
                        }
                    </div>
                </main>
            </div>
        </>
    );
}

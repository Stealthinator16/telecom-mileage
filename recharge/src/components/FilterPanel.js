export default function FilterPanel({
    ottBenefitOptions,
    otherBenefitOptions,
    activeFilters,
    onFilterChange,
    onReset
}) {
    return (
        <aside className="filter-panel">
            <div className="filter-header">
                <h2>Filters</h2>
                <button onClick={onReset} className="reset-icon-button" title="Reset all filters">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10"></polyline>
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                    </svg>
                </button>
            </div>

            <div className="filter-group">
                <h3>5G Access</h3>
                <div>
                    <label>
                        <input type="checkbox" className="filter-checkbox"
                            onChange={(e) => onFilterChange('unlimited_5g', 'true', e.target.checked)}
                            checked={activeFilters.unlimited_5g} />
                        Unlimited 5G Data
                    </label>
                </div>
            </div>

            <div className="filter-group">
                <h3>Operator</h3>
                <div>
                    {['Jio', 'Airtel', 'Vi', 'BSNL'].map(op => (
                        <label key={op}>
                            <input type="checkbox" className="filter-checkbox" value={op}
                                onChange={(e) => onFilterChange('operator', e.target.value, e.target.checked)}
                                checked={activeFilters.operator.includes(op)} /> {op}
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <h3>Validity (Days)</h3>
                <div>
                    <label><input type="checkbox" className="filter-checkbox" value="<30" onChange={(e) => onFilterChange('validity', e.target.value, e.target.checked)} checked={activeFilters.validity.includes('<30')} /> Less than 30</label>
                    <label><input type="checkbox" className="filter-checkbox" value="30-89" onChange={(e) => onFilterChange('validity', e.target.value, e.target.checked)} checked={activeFilters.validity.includes('30-89')} /> 30 - 89</label>
                    <label><input type="checkbox" className="filter-checkbox" value=">=90" onChange={(e) => onFilterChange('validity', e.target.value, e.target.checked)} checked={activeFilters.validity.includes('>=90')} /> 90+</label>
                </div>
            </div>

            <div className="filter-group">
                <h3>Data per Day</h3>
                <div>
                    {['1', '1.5', '2', '2.5', '3'].map(gb => (
                        <label key={gb}>
                            <input type="checkbox" className="filter-checkbox" value={gb}
                                onChange={(e) => onFilterChange('data_per_day', e.target.value, e.target.checked)}
                                checked={activeFilters.data_per_day.includes(gb)} /> {gb} GB
                        </label>
                    ))}
                </div>
            </div>

            {ottBenefitOptions.length > 0 && (
                <div className="filter-group">
                    <h3>OTT & Services</h3>
                    <div>
                        {ottBenefitOptions.map(benefit => (
                            <label key={benefit}>
                                <input type="checkbox" className="filter-checkbox" value={benefit}
                                    onChange={(e) => onFilterChange('ott_benefits', e.target.value, e.target.checked)}
                                    checked={activeFilters.ott_benefits.includes(benefit)} /> {benefit}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {otherBenefitOptions.length > 0 && (
                <div className="filter-group">
                    <h3>Other Benefits</h3>
                    <div>
                        {otherBenefitOptions.map(benefit => (
                            <label key={benefit}>
                                <input type="checkbox" className="filter-checkbox" value={benefit}
                                    onChange={(e) => onFilterChange('other_benefits', e.target.value, e.target.checked)}
                                    checked={activeFilters.other_benefits.includes(benefit)} /> {benefit}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
}

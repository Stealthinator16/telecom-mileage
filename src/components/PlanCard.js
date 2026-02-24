"use client";

const getCostPerDayClass = (cost) => {
    if (cost < 10) return 'cost-green';
    if (cost < 12) return 'cost-amber';
    return 'cost-red';
};

const getCostPerGbClass = (cost) => {
    if (cost === null || cost === undefined) return '';
    if (cost < 6) return 'cost-green';
    if (cost < 10) return 'cost-amber';
    return 'cost-red';
};

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default function PlanCard({ plan, badges = [] }) {
    const costPerDayClass = getCostPerDayClass(plan.cost_per_day);
    const costPerGbClass = getCostPerGbClass(plan.cost_per_gb);
    const costPerGbText = plan.cost_per_gb ? `₹${plan.cost_per_gb.toFixed(2)}` : 'N/A';

    return (
        <div className={`plan-card ${plan.operator.toLowerCase()}`}>
            {badges.length > 0 && (
                <div className="badge-container">
                    {badges.map(badge => (
                        <span key={badge} className="best-value-badge">{badge}</span>
                    ))}
                </div>
            )}
            <div className="card-header">
                <h3><span className="price-symbol">₹</span>{plan.price}</h3>
                <div className="header-right">
                    <span className="operator-tag">{plan.operator}</span>
                    <span className="validity-text">{plan.validity_days} Days</span>
                </div>
            </div>
            <div className="card-body">
                <p><strong>Data:</strong> {plan.data.display_text}</p>
                <p><strong>Calls:</strong> {plan.voice}</p>
                <p><strong>SMS:</strong> {plan.sms || '100/day'}</p>
                {plan.additional_benefits.length > 0 && (
                    <div className="benefits">
                        <strong>Benefits:</strong>
                        <ul>
                            {plan.additional_benefits.map((benefit, index) => (
                                <li key={index}>
                                    <CheckIcon />
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className="card-footer">
                <span>Cost/Day: <span className={`cost-value ${costPerDayClass}`}>{`₹${plan.cost_per_day.toFixed(2)}`}</span></span>
                <span>Cost/GB: <span className={`cost-value ${costPerGbClass}`}>{costPerGbText}</span></span>
            </div>
        </div>
    );
}

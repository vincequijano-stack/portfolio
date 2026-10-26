import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { getSessionName, NAME_CHANGED_EVENT, requestVisitorName } from '../services/visitorSession';

/** Current session display name; updates when it changes anywhere in the app. */
export function useVisitorName(): string {
  const [name, setName] = useState(() => getSessionName());
  useEffect(() => {
    const update = () => setName(getSessionName());
    window.addEventListener(NAME_CHANGED_EVENT, update);
    return () => window.removeEventListener(NAME_CHANGED_EVENT, update);
  }, []);
  return name;
}

interface VisitorIdentityChipProps {
  /** e.g. "Reviewing as" / "Liking as" */
  label?: string;
  className?: string;
}

/**
 * Small "Posting as <name> · Change" line. Changing the name only affects future interactions;
 * already-saved reviews and likes keep the name they were submitted with.
 */
export const VisitorIdentityChip: React.FC<VisitorIdentityChipProps> = ({ label = 'Interacting as', className = '' }) => {
  const name = useVisitorName();
  if (!name) return null;
  return (
    <div className={`flex items-center gap-1.5 text-[11px] text-[#737373] dark:text-[#A8A8A8] ${className}`}>
      <User className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
      <span className="truncate">
        {label} <strong className="font-semibold text-[#262626] dark:text-white">{name}</strong>
      </span>
      <span aria-hidden="true">·</span>
      <button
        type="button"
        onClick={() => requestVisitorName({ force: true })}
        className="font-semibold text-[#0095F6] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0095F6] rounded cursor-pointer"
        aria-label={`Change display name (currently ${name})`}
      >
        Change
      </button>
    </div>
  );
};

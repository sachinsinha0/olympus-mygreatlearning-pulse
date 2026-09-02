import { useNavigate } from "react-router-dom";
import { usePageLoader } from "../../components/common/PageLoader";
import { usePricing } from "../../lib/pulse/pricing";
import { selectLandingModules } from "../../lib/pulse/landingModules";
import { getDefaultItemId } from "../../lib/pulse/courseItems";
import type { PulseIssue } from "../../lib/pulse/types";
import issuesData from "../../mocks/pulse-issues.json";

/**
 * Starts the trial and drops the lead inside the product.
 *
 * Shared by the sign up dialog and the login step, which are two doors onto the same
 * thing. It lived only in the login page until the dialog needed it too, and a second
 * copy of a navigation rule this fiddly would drift.
 */
export function useStartTrial() {
  const navigate = useNavigate();
  const { runWithPageLoader } = usePageLoader();
  const { startTrial } = usePricing();

  return () => {
    // The freshest module, which is the far end of the chronological list the landing
    // page shows. Same destination as the Start Free Trial button on /pulse.
    const newest = selectLandingModules(issuesData as PulseIssue[]).newest;
    runWithPageLoader(() => {
      startTrial();
      if (!newest) {
        // Nothing released. Send them to the Pulse home rather than to
        // /pulse/modules/, which matches no route and would strand them on a blank page.
        navigate("/pulse");
        return;
      }
      const itemId = getDefaultItemId(newest.id, false);
      const itemPath = itemId ? `/items/${itemId}` : "";
      navigate(`/pulse/modules/${newest.id}${itemPath}?trial=started`);
    }, 950);
  };
}

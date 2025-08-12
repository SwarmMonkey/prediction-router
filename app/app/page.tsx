import { FetchEvents } from '@/lib/data';
import EventsDisplay from '@/components/mycomp/EventsDisplay';

export default async function Page() {
  const eventsResult = await FetchEvents();
  const initialEventsWithMarkets = eventsResult?.events ?? [];

  return (
    <> 
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col space-y-2.5">
          <div className="mt-6 mb-4 flex flex-row justify-between">
            {/* Empty div for consistent spacing */}
          </div>
          <EventsDisplay allEvents={initialEventsWithMarkets} />
        </div>
      </div>
    </>
  );
}

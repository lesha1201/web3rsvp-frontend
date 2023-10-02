import { gql } from "@apollo/client";
import {
  FaceSmileIcon,
  TicketIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getClient } from "../../../utils/apollo-client";
import formatTimestamp from "../../../utils/formatTimestamp";

const query = gql`
  query Event($id: String!) {
    event(id: $id) {
      id
      eventId
      eventOwner
      eventTimestamp
      maxCapacity
      deposit
      totalRSVPs
      totalConfirmedAttendees
      metadata {
        id
        name
        description
        link
        imageUrl
      }
      rsvps {
        id
        attendee {
          id
        }
      }
    }
  }
`;

export const revalidate = 5;

export async function generateMetadata({ params }) {
  const client = getClient();

  const {
    data: { event },
  } = await client.query({ query, variables: { id: params.id } });

  if (!event || !event.metadata) {
    return {};
  }

  return {
    title: `${event.metadata.name} | web3rsvp`,
    description: event.metadata.description,
  };
}

export default async function Event({ params }) {
  const client = getClient();

  const {
    data: { event },
  } = await client.query({ query, variables: { id: params.id } });

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="relative py-12">
        <h6 className="mb-2">{formatTimestamp(event.eventTimestamp)}</h6>
        <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl mb-6 lg:mb-12">
          {event.metadata?.name}
        </h1>
        <div className="flex flex-wrap-reverse lg:flex-nowrap">
          <div className="w-full pr-0 lg:pr-24 xl:pr-32">
            <div className="mb-8 w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
              {event.metadata?.imageUrl && (
                <Image src={event.metadata.imageUrl} alt="Event image" fill />
              )}
            </div>
            <p>{event.metadata?.description}</p>
          </div>
          <div className="max-w-xs w-full flex flex-col gap-4 mb-6 lg:mb-0">
            <div className="flex item-center">
              <UsersIcon className="w-6 mr-2" />
              <span className="truncate"># attending</span>
            </div>
            <div className="flex item-center">
              <TicketIcon className="w-6 mr-2" />
              <span className="truncate">1 RSVP per wallet</span>
            </div>
            <div className="flex items-center">
              <FaceSmileIcon className="w-10 mr-2" />
              <span className="truncate">
                Hosted by{" "}
                <a
                  className="text-indigo-800 truncate hover:underline"
                  href={`${process.env.NEXT_PUBLIC_TESTNET_EXPLORER_URL}/address/${event.eventOwner}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {event.eventOwner}
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

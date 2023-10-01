"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { decodeEventLog, parseEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWaitForTransaction } from "wagmi";

import Alert from "../../components/Alert";
import getRandomImage from "../../utils/getRandomImage";
import {
  useWeb3RSVPContractWrite,
  web3RSVPContract,
} from "../../utils/useWeb3RSVPContract";

export default function CreateEvent() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [refund, setRefund] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { address: accountAddress } = useAccount();

  const { data, write } = useWeb3RSVPContractWrite({
    functionName: "createNewEvent",
    gas: 900_000n,
  });

  const {
    data: transaction,
    isLoading,
    isSuccess,
    error,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  const createEvent = async (cid) => {
    try {
      const eventDateAndTime = new Date(`${eventDate} ${eventTime}`);
      const eventTimestamp = eventDateAndTime.getTime();
      const deposit = parseEther(refund);
      const eventDataCID = cid;

      write({
        args: [eventTimestamp, deposit, maxCapacity, eventDataCID],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      name: eventName,
      description: eventDescription,
      link: eventLink,
      image: getRandomImage(),
    };

    try {
      const response = await fetch("/api/store-event-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.status !== 200) {
        alert("Oops! Something went wrong. Please refresh and try again.");
      } else {
        const responseData = await response.json();
        createEvent(responseData.cid);
      }
    } catch (error) {
      alert(
        `Oops! Something went wrong. Please refresh and try again. Error ${error}`,
      );
    }
  };

  useEffect(() => {
    function onWheel() {
      // disable scroll on <input> elements of type number
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    }

    document.addEventListener("wheel", onWheel);

    return () => {
      document.removeEventListener("wheel", onWheel);
    };
  }, []);

  const transactionEvent = transaction?.logs[0];

  const event = useMemo(() => {
    return transactionEvent
      ? decodeEventLog({
          abi: web3RSVPContract.abi,
          data: transactionEvent.data,
          topics: transactionEvent.topics,
        })
      : undefined;
  }, [transactionEvent]);

  const eventId = event?.args.eventId;

  if (!isMounted) {
    return null;
  }

  return (
    <section className="relative py-12">
      {!isSuccess && (
        <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl mb-4">
          Create your virtual event
        </h1>
      )}

      {isLoading && (
        <Alert
          alertType="loading"
          alertBody="Please wait"
          triggerAlert
          color="white"
        />
      )}
      {isSuccess && (
        <Alert
          alertType="success"
          alertBody="Your event has been created successfully."
          triggerAlert
          color="palegreen"
        />
      )}
      {error && (
        <Alert
          alertType="failed"
          alertBody={`There was an error creating your event: ${error.message}`}
          triggerAlert
          color="palevioletred"
        />
      )}

      {accountAddress && !isSuccess && (
        <form
          onSubmit={handleSubmit}
          className="space-y-8 divide-y divide-gray-200"
        >
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label
                htmlFor="eventname"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Event name
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  id="event-name"
                  name="event-name"
                  type="text"
                  className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Date & time
                <p className="mt-1 max-w-2xl text-sm text-gray-400">
                  Your event date and time
                </p>
              </label>
              <div className="mt-1 sm:mt-0 flex flex-wrap sm:flex-nowrap gap-2">
                <div className="w-1/2">
                  <input
                    id="date"
                    name="date"
                    type="date"
                    className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
                <div className="w-1/2">
                  <input
                    id="time"
                    name="time"
                    type="time"
                    className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label
                htmlFor="max-capacity"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Max capacity
                <p className="mt-1 max-w-2xl text-sm text-gray-400">
                  Limit the number of spots available for your event.
                </p>
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="number"
                  name="max-capacity"
                  id="max-capacity"
                  min="1"
                  placeholder="100"
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label
                htmlFor="refundable-deposit"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Refundable deposit
                <p className="mt-1 max-w-2xl text-sm text-gray-400">
                  Require a refundable deposit (in MATIC) to reserve one spot at
                  your event
                </p>
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="number"
                  name="refundable-deposit"
                  id="refundable-deposit"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
                  value={refund}
                  onChange={(e) => setRefund(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label
                htmlFor="event-link"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Event link
                <p className="mt-1 max-w-2xl text-sm text-gray-400">
                  The link for your virtual event
                </p>
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  id="event-link"
                  name="event-link"
                  type="text"
                  className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                  required
                  value={eventLink}
                  onChange={(e) => setEventLink(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Event description
                <p className="mt-2 text-sm text-gray-400">
                  Let people know what your event is about!
                </p>
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <textarea
                  id="about"
                  name="about"
                  rows={10}
                  className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="pt-5">
            <div className="flex justify-end">
              <Link
                href="/"
                className="bg-white py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create
              </button>
            </div>
          </div>
        </form>
      )}

      {!accountAddress && (
        <section className="flex flex-col items-start py-8">
          <p className="mb-4">Please connect your wallet to create events.</p>
          <ConnectButton />
        </section>
      )}

      {isSuccess && eventId && (
        <div>
          Success! Please wait a few minutes, then check out your event page{" "}
          <span className="font-bold">
            <Link href={`/event/${eventId}`}>here</Link>
          </span>
        </div>
      )}
    </section>
  );
}

"use client";

import { TNewApplicationResponse, TPoolData, TPoolMetadata } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import Breadcrumb from "../shared/Breadcrumb";
import Image from "next/image";
import { aspectRatio } from "@/utils/config";
import { classNames, stringToColor } from "@/utils/common";
import PoolDetail from "./PoolDetail";
import ApplicationList from "../application/ApplicationList";

export default function PoolOverview(props: {
  chainId: string;
  poolId: string;
  pool: TPoolData;
  metadata: TPoolMetadata;
  poolBanner: string | undefined;
  applications: TNewApplicationResponse[];
}) {
  const bannerRef = useRef<any>(null);
  const [bannerSize, setBannerSize] = useState({
    width: 0,
    height: 0,
  });

  const [tabs, setTabs] = useState([
    { name: "Pool Details", current: true },
    { name: "Applications", current: false },
  ]);

  const breadcrumbs = [
    { id: 1, name: "Home", href: "/" },
    {
      id: 2,
      name: `Pool ${props.poolId}`,
      href: `/${props.chainId}/${props.poolId}`,
    },
  ];

  console.log("====pool====", props.pool);
  console.log("====metadata====", props.metadata);

  // select the current tab by name
  const onTabClick = (tabName: string) => {
    setTabs((tabs) =>
      tabs.map((tab) => ({
        ...tab,
        current: tab.name === tabName,
      }))
    );
  };

  useEffect(() => {
    if (bannerRef.current) {
      setBannerSize({
        width: bannerRef.current.offsetWidth,
        height: Math.ceil(bannerRef.current.offsetWidth / aspectRatio),
      });
    }
  }, [bannerRef]);

  const currentTab = tabs.find((tab) => tab.current)?.name;

  return (
    <div className="bg-white">
      <div ref={bannerRef} className="pt-6 w-full">
        <Breadcrumb breadcrumbs={breadcrumbs} />

        {/* Banner */}
        <div className="mx-auto mt-6 max-h-[20rem] sm:px-6 lg:grid lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            {props.poolBanner ? (
              <Image
                src={props.poolBanner}
                alt="poolBanner"
                className="h-full w-full object-cover object-center"
                layout="responsive"
                width={bannerSize.width}
                height={bannerSize.height}
              />
            ) : (
              <div
                className="flex items-center justify-center"
                style={{
                  width: `${bannerSize.width}px`,
                  height: `${bannerSize.height}px`,
                  backgroundColor: stringToColor(
                    props.metadata.name ?? (Math.random() * 10000).toString()
                  ),
                }}
              >
                <span className="text-gray-400 text-3xl">
                  {props.metadata.name}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            defaultValue={currentTab}
          >
            {tabs.map((tab) => (
              <option key={tab.name} onClick={() => onTabClick(tab.name)}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block px-8 pt-10">
          <div className="border-b border-gray-200 w-80">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <span
                  onClick={() => onTabClick(tab.name)}
                  key={tab.name}
                  className={classNames(
                    tab.current
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer"
                  )}
                  aria-current={tab.current ? "page" : undefined}
                >
                  {tab.name}
                </span>
              ))}
            </nav>
          </div>
        </div>

        {/* Pool info */}
        {currentTab === "Pool Details" ? (
          <PoolDetail
            poolBanner={props.poolBanner}
            chainId={props.chainId}
            poolId={props.poolId}
            pool={props.pool}
            metadata={props.metadata}
          />
        ) : (
          <ApplicationList applications={props.applications} />
        )}
      </div>
    </div>
  );
}

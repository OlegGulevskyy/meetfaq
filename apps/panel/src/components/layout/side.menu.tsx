"use client";

import {FC, ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {clsx} from "clsx";
import FaqIcon from "@meetfaq/panel/src/components/icons/faq.icon";
import BillingIcon from "@meetfaq/panel/src/components/icons/billing.icon";
import OrgSettingsIcon from "@meetfaq/panel/src/components/icons/org.settings";
import {usePathname} from "next/navigation";
import Link from "next/link";
import StyleComponent from "@meetfaq/panel/src/components/icons/style.component";
import IntegrationsIcon from "@meetfaq/panel/src/components/icons/integrations.icon";
import LogoutIcon from "@meetfaq/panel/src/components/icons/logout.icon";

const SideMenuItem: FC<{svg: ReactNode, title: string, path: string, disableReload?: boolean}> = (props) => {
  const {svg, title, path, disableReload} = props;
  const pathname = usePathname();
  const selected = useMemo(() => {
    return pathname?.indexOf(props.path)! > -1;
  }, [pathname]);

    useEffect(() => {
        setSelectedState(selected);
    }, [selected]);

  const [selectedState, setSelectedState] = useState(selected);
  const changeState = useCallback(() => {
    if (selected) {
      return ;
    }

    setSelectedState(!selectedState);
  }, [selected, selectedState]);

  return (
    <Link href={path} prefetch={!disableReload} className={clsx("h-[80px] flex relative justify-center items-center font-[600] text-[11px] cursor-pointer transition-all", selectedState ? 'bg-menu text-white' : 'text-[#624A81]')} onMouseEnter={changeState} onMouseLeave={changeState}>
      <div className={clsx("absolute right-0 top-0 h-full w-[5px] bg-btn transition-opacity", !selectedState && "opacity-0")}  />
      <div className="flex flex-col items-center gap-[2px]">
        <div>{svg}</div>
        <div>{title}</div>
      </div>
    </Link>
  )
}
export const SideMenu: FC<{pricing: boolean}> = (props) => {
  const {pricing} = props;
  return (
    <div className="flex flex-col flex-1">
      <SideMenuItem svg={<FaqIcon />} title="FAQs" path='/faqs' />
      <SideMenuItem svg={<StyleComponent />} title="Style" path='/style' />
      <SideMenuItem svg={<IntegrationsIcon />} title="Integrations" path='/integrations' />
      <SideMenuItem svg={<OrgSettingsIcon />} title="Settings" path='/settings' />
      {pricing && <SideMenuItem svg={<BillingIcon />} title="Billing" path='/billing' />}
      <div className="flex-1 justify-end flex flex-col w-full">
        <SideMenuItem svg={<LogoutIcon />} disableReload={true} title="Logout" path='/auth/logout' />
      </div>
    </div>
  )
}

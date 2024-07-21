import * as React from "react";
import { useState, useEffect, Component } from "react";
import styles from "./Header.module.scss";
import "./Style.css";
import * as moment from "moment";
import { graph } from "@pnp/graph/presets/all";
import { sp } from "@pnp/sp/presets/all";
import {
  CommandBarButton,
  IContextualMenuProps,
  Icon,
  Label,
} from "@fluentui/react";

export interface IHeaderDetail {
  ID: number;
  Title: string;
  URL: string;
  SubFolderFor: string;
  isActive: boolean;
  isDelete: boolean;
  isMain: boolean;
}

export interface IRMData {
  ID: number;
  Description: string;
  StartDate?: Date;
  EndDate?: Date;
  isActive?: boolean;
  isDelete?: boolean;
}

export interface IHead {
  Title: string;
  URL: string;
  isSelect: boolean;
  _item?: IContextualMenuProps;
}

let _arrHeader: IHeaderDetail[] = [];
let _arrADSuperAdminUsers: string[] = [];
let _arrADUser: string[] = [];
let _isSuperdmin: boolean = false;
let _isRMAdmin: boolean = false;
let _curUser: string = "";

let listName = "Intranet RollableNews";

const ReactHeader = () => {
  // Local variable creations

  // State creations
  const [isLoader, setIsLoader] = useState<boolean>(true);
  const [HeaderDatas, setHeaderDatas] = useState<IHead[]>([]);
  const [RMessageData, setRMessageData] = useState<string>("");
  const [isadmin, setIsAdmin] = useState(false);

  // Functions creations
  const _getErrorFun = (err: any): void => {
    setIsLoader(false);
  };

  const getCurrentUrl = () => {
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.split("/SitePages/")[0];
    return `${baseUrl}/Lists/${listName}/AllItems.aspx`;
  };

  // const _getDefaultFun = (): void => {
  //   setIsLoader(true);
  //   _isSuperdmin = false;
  //   _isRMAdmin = false;
  //   _getCurUserDetail();
  // };

  const _getCurUserDetail = async () => {
    let userProps: any = await sp.web.currentUser();
    _curUser = userProps.Email;

    _getAdmin();
    // _getADSuperAdminDetails();
  };

  const _getAdmin = (): void => {
    sp.web.siteGroups
      // .getByName("Achaulien Owners")
      // .getByName("Ägare av Intranet Dev")
      .getByName("aclhub Owners")
      .users.get()
      .then((res: any) => {
        let _isAdmin = res.some(
          (val: any) => val.Email.toLowerCase() === _curUser.toLowerCase()
        );
        setIsAdmin(_isAdmin);
        displayEditHandler(_isAdmin);
      })
      .catch((err: any) => {
        setIsLoader(false);
      });
  };

  const _getRMessageData = async () => {
    try {
      // Fetch the items from the SharePoint list
      const res = await sp.web.lists
        .getByTitle("Intranet RollableNews")
        // .getByTitle("Message")

        .items.top(4000)
        .orderBy("Modified", false)
        .get();

      let _curArray: IRMData[] = [];
      let _curMessage: string = "";
      let _curNews: string = "";

      if (res.length) {
        for (let i = 0; res.length > i; i++) {
          // if (res[i].isActive === true && res[i].Description !== "" || res[i].Description !==null)
          if (res[i].isActive === true && res[i].Description !== null) {
            _curArray.push({
              ID: res[i].ID,
              Description: res[i].Description
                ? res[i].Description.replace(/\n/g, "")
                : "",
              isActive: res[i].isActive ? true : false,
            });

            _curNews += res[i].Description.replace(/\n/g, "") + " | ";
          }

          if (res.length === i + 1 && _curNews) {
            let _strArr: string[] = [];
            _strArr = _curNews.split(" | ");
            _strArr.pop();
            _curMessage = _strArr.join(`      |      `);
          }
        }
      }

      setRMessageData(_curMessage);
      setIsLoader(false);
    } catch (err) {
      console.log(err);

      _getErrorFun(err);
    }
  };

  const displayEditHandler = (admin) => {
    const siteHeader = document.querySelector(".sp-pageLayout-horizontalNav");
    const siteContent = document.querySelector(".sp-App-bodyContainer");

    const elementsToHide = document.querySelector(".commandBarWrapper");
    console.log(elementsToHide, "elementHide");
    if (elementsToHide) {
      if (!admin) {
        elementsToHide.setAttribute("data-custom-class", "achulienadmin");
      } else {
        elementsToHide.removeAttribute("data-custom-class");
      }
    }

    if (siteHeader) {
      if (!admin) {
        siteHeader.setAttribute("data-custom-class", "nonAdmin");
      } else {
        siteHeader.removeAttribute("data-custom-class");
      }
    }
    _getRMessageData();

    // if (siteContent) {
    //   if (!(_isSuperdmin || _isRMAdmin)) {
    //     siteContent.setAttribute("data-custom-class", "nonAdmin");
    //   } else {
    //     siteContent.removeAttribute("data-custom-class");
    //   }
    // }
  };

  useEffect(() => {
    _getCurUserDetail();
  }, []);

  return (
    // !isLoader && (
    //   <div>
    //     {/* Rotating message section */}
    //     {RMessageData ? (
    //       <div className={styles._scrolling}>
    //         <marquee>
    //           <pre>{RMessageData}</pre>
    //         </marquee>

    //         {/* <p>{RMessageData}</p> */}
    //         {isadmin && (
    //           <Label
    //             style={{
    //               backgroundColor: "#24292e",
    //               zIndex: 2,
    //               position: "absolute",
    //               top: 0,
    //               right: 0,
    //               bottom: 0,
    //               height: 48,
    //               width: 48,
    //               display: "flex",
    //               justifyContent: "center",
    //               alignItems: "center",
    //             }}
    //           >
    //             <Icon
    //               iconName="Edit"
    //               style={{
    //                 color: "#ffff",
    //                 cursor: "pointer",
    //                 fontSize: 18,
    //               }}
    //               onClick={() => {
    //                 window.open(
    //                   "https://achaulien.sharepoint.com/sites/IntranetDev/Lists/IntranetRollableNews/AllItems.aspx",
    //                   "_self"
    //                 );
    //               }}
    //             />
    //           </Label>
    //         )}
    //       </div>
    //     ) : (
    //       <div className={styles._scrolling}>
    //         <marquee>
    //           <pre>no data found !!!</pre>
    //         </marquee>

    //         {isadmin && (
    //           <Label
    //             style={{
    //               backgroundColor: "#24292e",
    //               zIndex: 2,
    //               position: "absolute",
    //               top: 0,
    //               right: 0,
    //               bottom: 0,
    //               height: 48,
    //               width: 48,
    //               display: "flex",
    //               justifyContent: "center",
    //               alignItems: "center",
    //             }}
    //           >
    //             <Icon
    //               iconName="Edit"
    //               style={{
    //                 color: "#ffff",
    //                 cursor: "pointer",
    //                 fontSize: 18,
    //               }}
    //               onClick={() => {
    //                 window.open(
    //                   "https://achaulien.sharepoint.com/sites/IntranetDev/Lists/IntranetRollableNews/AllItems.aspx",
    //                   "_self"
    //                 );
    //               }}
    //             />
    //           </Label>
    //         )}
    //       </div>
    //     )}
    //   </div>
    // )

    //new

    !isLoader && (
      <div>
        {/* Rotating message section */}
        {RMessageData ? (
          <div className={styles._scrolling}>
            <div className={styles.scrollText}>
              <pre>{RMessageData}</pre>
            </div>

            {isadmin && (
              <Label
                style={{
                  backgroundColor: "#24292e",
                  zIndex: 2,
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  height: 48,
                  width: 48,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  iconName="Edit"
                  style={{
                    color: "#ffff",
                    cursor: "pointer",
                    fontSize: 18,
                  }}
                  onClick={() => {
                    window.open(getCurrentUrl());
                    // window.open(
                    //   "https://achaulien.sharepoint.com/sites/IntranetDev/Lists/IntranetRollableNews/AllItems.aspx",
                    //   "_self"
                    // );
                  }}
                />
              </Label>
            )}
          </div>
        ) : (
          isadmin && (
            <div className={styles._scrolling}>
              <div className={styles.scrollText}>
                <pre>No data found !!!</pre>
              </div>

              {isadmin && (
                <Label
                  style={{
                    backgroundColor: "#24292e",
                    zIndex: 2,
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    height: 48,
                    width: 48,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    iconName="Edit"
                    style={{
                      color: "#ffff",
                      cursor: "pointer",
                      fontSize: 18,
                    }}
                    onClick={() => {
                      window.open(getCurrentUrl());

                      // window.open(
                      //   "https://achaulien.sharepoint.com/sites/IntranetDev/Lists/IntranetRollableNews/AllItems.aspx",
                      //   "_self"
                      // );
                    }}
                  />
                </Label>
              )}
            </div>
          )
        )}
      </div>
    )
  );
};

export default ReactHeader;

import React, { useState, useCallback, useEffect } from 'react';
import { AppMenu } from './AppMenu';
import { history } from '@/_helpers';
import moment from 'moment';
import { ToolTip } from '@/_components';
import useHover from '@/_hooks/useHover';
import configs from './Configs/AppIcon.json';

const { defaultIcon } = configs;

export default function AppCard({
  app,
  canCreateApp,
  canDeleteApp,
  deleteApp,
  cloneApp,
  exportApp,
  appActionModal,
  canUpdateApp,
}) {
  const [hoverRef, isHovered] = useHover();
  const [focused, setFocused] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const onMenuToggle = useCallback(
    (status) => {
      setMenuOpen(!!status);
      !status && !isHovered && setFocused(false);
    },
    [isHovered]
  );

  const appActionModalCallBack = useCallback(
    (action) => {
      appActionModal(app, action);
    },
    [app, appActionModal]
  );

  useEffect(() => {
    !isMenuOpen && setFocused(!!isHovered);
  }, [isHovered]);

  const updated = moment(app.created_at).fromNow(true);

  return (
    <div className={`app-card mb-3 p-3 pt-2${focused ? ' highlight' : ''}`} key={app.id} ref={hoverRef}>
      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-between">
          <div className="pt-2">
            <div className="app-icon-main p-1">
              <div className="app-icon p-1 d-flex">
                <img src={`/assets/images/icons/app-icons/${app.icon || defaultIcon}.svg`} alt="Application Icon" />
              </div>
            </div>
          </div>
          <div className="pt-1">
            {(canCreateApp(app) || canDeleteApp(app)) && (
              <AppMenu
                onMenuOpen={onMenuToggle}
                openAppActionModal={appActionModalCallBack}
                canCreateApp={canCreateApp()}
                canDeleteApp={canDeleteApp(app)}
                canUpdateApp={canUpdateApp(app)}
                deleteApp={() => deleteApp(app)}
                cloneApp={() => cloneApp(app)}
                exportApp={() => exportApp(app)}
                isMenuOpen={isMenuOpen}
              />
            )}
          </div>
        </div>
      </div>
      <div>
        <ToolTip message={app.name}>
          <div className="app-title">{app.name}</div>
        </ToolTip>
      </div>
      <div className="py-1">
        <div className="app-creator py-1">{`${app.user?.first_name ? app.user.first_name : ''} ${
          app.user?.last_name ? app.user.last_name : ''
        }`}</div>
        <div className="app-creation-time">
          <ToolTip message={app.created_at && moment(app.created_at).format('dddd, MMMM Do YYYY, h:mm:ss a')}>
            <span>{updated === 'just now' ? updated : `${updated} ago`}</span>
          </ToolTip>
        </div>
      </div>
      <div style={{ display: focused ? 'block' : 'none' }}>
        <div className="container-fluid d-flex flex-column align-content-center px-0 mt-1">
          <div className="row">
            <div className="col-6 pe-1">
              <ToolTip message="Open in app builder">
                <button
                  type="button"
                  className="btn btn-sm btn-light edit-button"
                  onClick={() => history.push(`/apps/${app.id}`)}
                >
                  Edit
                </button>
              </ToolTip>
            </div>
            <div className="col-6 ps-1">
              <ToolTip
                message={
                  app?.current_version_id === null ? 'App does not have a deployed version' : 'Open in app viewer'
                }
              >
                <span>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary launch-button"
                    disabled={app?.current_version_id === null}
                    onClick={() => {
                      if (app?.current_version_id) {
                        window.open(`/applications/${app.slug}`);
                      } else {
                        history.push(app?.current_version_id ? `/applications/${app.slug}` : '');
                      }
                    }}
                  >
                    Launch
                  </button>
                </span>
              </ToolTip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

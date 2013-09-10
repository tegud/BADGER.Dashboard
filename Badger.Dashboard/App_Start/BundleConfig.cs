using System.Web.Optimization;

namespace BADGER.Dashboard.App_Start
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/Assets/js/bundles/core")
                .Include("~/Assets/js/ladda.js")
                .Include("~/Assets/js/menu.js")
                .Include("~/Assets/js/lib/moment.js")
                .Include("~/Assets/js/lib/jquery-2.0.0.js")
                .Include("~/Assets/js/lib/lodash.js")
                .Include("~/Assets/js/lib/TLRGRP.core.js")
                .Include("~/Assets/js/lib/nanomachine.js"));
            var dashboardsBundle = BuildDashboardsBundle();
            bundles.Add(dashboardsBundle);
        }

        private static ScriptBundle BuildDashboardsBundle()
        {
            var dashboardsBundle = new ScriptBundle("~/Assets/js/bundles/dashboards");

            dashboardsBundle.Include("~/Assets/js/lib/jquery-ui.js",
                                     "~/Assets/js/lib/TLRGRP.BADGER.utilities.js");

            dashboardsBundle.Include("~/Assets/js/status-charts/TLRGRP.dashboards.Builder.js");

            dashboardsBundle.Include("~/Assets/js/status/UI/TLRGRP.BADGER.ColorPalette.js",
                                     "~/Assets/js/status/UI/TLRGRP.BADGER.DashboardList.js",
                                     "~/Assets/js/status/UI/TLRGRP.BADGER.TimeSelect.js");

            dashboardsBundle.Include("~/Assets/js/status/Sources/TLRGRP.BADGER.Cube.js");

            dashboardsBundle.Include("~/Assets/js/status/TLRGRP.BADGER.Machines.js",
                                     "~/Assets/js/status/TLRGRP.BADGER.Pages.js",
                                     "~/Assets/js/status/LateRooms/TLRGRP.BADGER.LateRooms.Machines.js",
                                     "~/Assets/js/status/LateRooms/TLRGRP.BADGER.LateRooms.Pages.js");

            dashboardsBundle.Include("~/Assets/js/status/Metrics/TLRGRP.BADGER.IIS.js",
                                     "~/Assets/js/status/Metrics/TLRGRP.BADGER.WMI.js",
                                     "~/Assets/js/status/Metrics/TLRGRP.BADGER.Errors.js");

            dashboardsBundle.Include("~/Assets/js/status/TLRGRP.BADGER.Dashboard.GraphFactory.js",
                                     "~/Assets/js/status/Graphs/TLRGRP.BADGER.Dashboard.Graphs.js",
                                     "~/Assets/js/status/Graphs/TLRGRP.BADGER.Dashboard.Graphs.IIS.js",
                                     "~/Assets/js/status/Graphs/TLRGRP.BADGER.Dashboard.Graphs.Errors.js");

            dashboardsBundle.Include("~/Assets/js/status/TLRGRP.BADGER.DashboardCollection.js",
                "~/Assets/js/status/TLRGRP.BADGER.Dashboard.Builder.js");

            dashboardsBundle.Include("~/Assets/js/status/Dashboards/TLRGRP.BADGER.Dashboard.GraphSet.js",
                                     "~/Assets/js/status/Dashboards/TLRGRP.BADGER.Dashboard.WebHosts.js",
                                     "~/Assets/js/status/Dashboards/TLRGRP.BADGER.Dashboard.ByHost.js",
                                     "~/Assets/js/status/Dashboards/TLRGRP.BADGER.Dashboard.Overview.js",
                                     "~/Assets/js/status/Dashboards/TLRGRP.BADGER.Dashboard.Mobile.js",
                                     "~/Assets/js/status/Dashboards/TLRGRP.BADGER.Dashboard.ByPage.js");

            dashboardsBundle.Include("~/Assets/js/status/TLRGRP.BADGER.StopStart.js",
                                     "~/Assets/js/status/TLRGRP.BADGER.MetricRequest.js");
            return dashboardsBundle;
        }
    }
}
using System.Web.Mvc;
using System.Web.Routing;

namespace BADGER.Dashboard.App_Start
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "V2",
                url: "V2/{*Data}",
                defaults: new { controller = "V2", action = "Index" });

            routes.MapRoute(
                name: "Status",
                url: "Status",
                defaults: new { controller = "Home", action = "Index" });

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}",
                defaults: new { controller = "Home", action = "Index" });
        }
    }
}
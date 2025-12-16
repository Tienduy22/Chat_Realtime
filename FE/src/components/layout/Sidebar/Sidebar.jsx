import { NavLink } from "react-router-dom";
import * as Icons from "lucide-react";
import { getSidebarRoutes } from "../../../routes";

const Sidebar = () => {
    const sidebarRoutes = getSidebarRoutes();

    return (
        <aside className="w-64 bg-white border-r border-gray-200">
            <nav className="p-4 space-y-2">
                {sidebarRoutes.map(({ path, meta }) => {
                    // Lấy icon từ lucide-react
                    const Icon = Icons[meta.icon] || Icons.Circle;

                    return (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? "bg-blue-50 text-blue-600 font-medium"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`
                            }
                        >
                            <Icon size={20} />
                            <span>{meta.title}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;

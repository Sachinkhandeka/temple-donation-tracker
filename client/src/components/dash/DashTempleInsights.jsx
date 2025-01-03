import TempleDietySection from "../TempleDietySection";
import TempleFestivalsSection from "../TempleFestivalsSection";
import TempleGeneralInfoSection from "../TempleGeneralInfoSection";
import TempleProfileSection from "../TempleProfileSection";
import TemplePriestSection from "../TemplePriestSection";
import TempleManagementSection from "../TempleManagmentSection";
import TempleVideosSection from "../TempleVideosSection";
import TemplePostsSection from "../TemplePostSection";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Alert from "../Alert";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";

export default function DashTempleInsights() {
    const  navigate = useNavigate();
    const { currUser } = useSelector( state => state.user );
    const [ temple, setTemple ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });

    // Function to get temple data
    const getTempleData = async () => {
        try {
            setLoading(true);
            setAlert({ type: "", message: "" });
            const data = await fetchWithAuth(
                `/api/temple/get/${currUser.templeId}`,
                {},
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setTemple(data.temple);
            }
        } catch (err) {
            setAlert({ type: "error", message: err.message });
        }
    };
    useEffect(() => {
        getTempleData();
    }, [currUser]);
    
    return(
        <>
            { currUser.isAdmin && (
                <section className="h-full flex flex-col md:flex-row gap-4">
                    {/* Alert Message */}
                    <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                        {alert && alert.message && (
                            <Alert
                                type={alert.type}
                                message={alert.message}
                                autoDismiss
                                onClose={() => setAlert(null)}
                            />
                        )}
                    </div>
                    <div className="flex flex-col flex-1" >
                        <TempleProfileSection temple={temple} setAlert={setAlert} />
                        <TempleDietySection temple={temple} setTemple={setTemple} setAlert={setAlert} />
                        <TemplePriestSection temple={temple} setTemple={setTemple} setAlert={setAlert} />
                        <TempleManagementSection temple={temple} setTemple={setTemple} setAlert={setAlert} />
                    </div>
                    <div className="flex-1" >
                        <TempleGeneralInfoSection temple={temple} setAlert={setAlert} />
                        <TempleFestivalsSection temple={temple} setTemple={setTemple} setAlert={setAlert} />
                        <TempleVideosSection temple={temple} setTemple={setTemple} setAlert={setAlert} />
                    </div>
                </section>
            ) }
            { currUser.isAdmin && ( <TemplePostsSection temple={temple} setTemple={setTemple} setAlert={setAlert} /> ) }
        </>
    );
}
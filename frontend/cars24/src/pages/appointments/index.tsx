import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Car, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getappointmentbyuser, cancelAppointment } from "@/services/appointmentService";

const AppointmentsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          setAppointments([]);
          return;
        }
        const list = await getappointmentbyuser(user.id);
        setAppointments(list && list.length > 0 ? list : []);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getStatusColor = (status: string) => {
    if (status === "upcoming" || status === "") return "bg-blue-500 text-white";
    if (status === "completed") return "bg-green-500 text-white";
    if (status === "cancelled") return "bg-red-500 text-white";
    return "bg-gray-500 text-white";
  };

  const getTypeLabel = (type: string) => {
    return type === "home_inspection" ? "Home Inspection" : "Branch Visit";
  };

  const handleCancel = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    
    try {
      await cancelAppointment(appointmentId);
      alert("Appointment cancelled successfully");
      window.location.reload();
    } catch (error) {
      alert("Failed to cancel appointment: " + error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            My Appointments
          </h1>

          {appointments && appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((item: any) => {
                const apt = item.appointment;
                const car = item.car;
                const isUpcoming = apt.status === "upcoming" || apt.status === "";
                const date = new Date(apt.scheduledDate).toISOString().split("T")[0];

                return (
                  <div key={apt.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className={`px-4 py-2 ${getStatusColor(apt.status)}`}>
                      <span className="text-white text-sm font-medium capitalize">
                        {apt.status || "upcoming"}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                            <Car className="w-5 h-5 mr-2 text-gray-500" />
                            {car.title}
                          </h3>

                          <div className="space-y-2">
                            <p className="text-gray-600 flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              Date: {date}
                            </p>
                            <p className="text-gray-600 flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Time: {apt.scheduledTime}
                            </p>
                            <p className="text-gray-600 flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              Location: {apt.location}
                            </p>
                            <p className="text-gray-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Type: {getTypeLabel(apt.appointmentType)}
                            </p>
                          </div>

                          {apt.notes && (
                            <div className="mt-4 bg-gray-50 p-4 rounded-md">
                              <p className="text-sm text-gray-700">{apt.notes}</p>
                            </div>
                          )}
                        </div>

                        {isUpcoming && (
                          <button
                            onClick={() => handleCancel(apt.id)}
                            className="ml-4 text-red-600 hover:text-red-700 text-sm font-medium whitespace-nowrap"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      {isUpcoming && (
                        <div className="mt-6 bg-blue-50 p-4 rounded-md">
                          <p className="text-sm text-blue-800 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Keep your car's documents ready for inspection
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Appointments</h3>
              <p className="text-gray-600 mt-2">You don't have any appointments scheduled</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppointmentsPage;





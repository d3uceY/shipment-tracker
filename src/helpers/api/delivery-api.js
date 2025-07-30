import axiosInstance from "@/lib/axiosInstance";
import { deliveryApi } from "@/lib/APIconstants";






export const getDeliveries = async () => {
    try {
        const response = await axiosInstance.get(deliveryApi.GET_DELIVERIES);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const createDelivery = async (data) => {
    try {
        const response = await axiosInstance.post(deliveryApi.CREATE_DELIVERY, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const getShipmentById = async (id) => {
    try {
        const response = await axiosInstance.get(deliveryApi.GET_SHIPMENT_BY_ID + `/${id}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export const changeDeliveryStatus = async (id, status) => {
    try {
        const response = await axiosInstance.put(deliveryApi.CHANGE_DELIVERY_STATUS + `/${id}`, { status });
        return response.data;
    } catch (error) {
        throw error;
    }
}

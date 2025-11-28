
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const EmailService = {
  /**
   * Simula el envío de un formulario de contacto y el disparo de un email automático.
   */
  sendContactForm: async (data: ContactFormData): Promise<{ success: boolean; message: string }> => {
    console.log("Procesando formulario de contacto:", data);
    
    // Simular retardo de red
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular lógica de backend (Odoo/SMTP)
    console.log(`📧 [SISTEMA] Enviando notificación a ventas@numostock.cl: Nuevo lead de ${data.name}`);
    console.log(`📧 [SISTEMA] Enviando auto-respuesta a ${data.email}: "Gracias por contactar a NumoStock..."`);

    return {
      success: true,
      message: "Mensaje enviado correctamente. Hemos enviado una copia a tu correo."
    };
  }
};

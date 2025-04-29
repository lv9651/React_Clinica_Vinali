import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Link,
  PDFViewer,
} from "@react-pdf/renderer";

import logo from "../assets/Vinali.png";
import facebookIcon from "../assets/facebook.png";
import instagramIcon from "../assets/instagram.png";
import tiktokIcon from "../assets/tiktok.png";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  logo: {
    width: 120,
    height: 80,
  },
  contactBlock: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  linkText: {
    fontSize: 10,
    textDecoration: "underline",
  },
  infoText: {
    fontSize: 10,
    marginTop: 2,
    marginBottom: 4,
  },
  socialRow: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  socialItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  icon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  fieldsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  fieldBox: {
    width: "24%",
  },
  labelText: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  underlineField: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 2,
  },
  barTitle: {
    backgroundColor: "#d9d9d9",
    textAlign: "center",
    padding: 4,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionLabel: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  sectionText: {
    marginBottom: 10,
    lineHeight: 1.2,
  },
  datesText: {
    marginBottom: 15,
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: "#00BCD4",
    textDecoration: "underline",
    marginBottom: 10,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  productBlock: {
    width: "100%",
    marginBottom: 10,
  },
  productLine: {
    fontSize: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  descriptionText: {
    width: "50%",
    fontWeight: "bold",
  },
  quantityText: {
    width: "20%",
  },
  doseText: {
    width: "30%",
  },
  extraSection: {
    marginBottom: 5,
  },
  doctorInfo: {
    marginTop: 20,
    textAlign: "right",
  },
});
const RecetaPDF = ({ receta = [] }) => {
  const data = Array.isArray(receta) ? receta : [];

  return (
    <Document>
      {data.map((item, idx) => (
        <Page key={idx} size="A4" style={styles.page}>
          {/* Header: logo and contact block */}
          <View style={styles.header}>
              <Image src={logo} style={styles.logo} />
              <View style={styles.contactBlock}>
                <Link src="https://www.vinali.pe/" style={styles.linkText}>
                  www.vinali.pe
                </Link>
                <Text style={styles.infoText}>Informes al +51 993 805 070</Text>
                <View style={styles.socialRow}>
                  <View style={styles.socialItem}>
                    <Image src={facebookIcon} style={styles.icon} />
                    <Text>@vinalicentrodermatologico</Text>
                  </View>
                  <View style={styles.socialItem}>
                    <Image src={instagramIcon} style={styles.icon} />
                    <Text>@vinalicentrodermatologico</Text>
                  </View>
                  <View style={styles.socialItem}>
                    <Image src={tiktokIcon} style={styles.icon} />
                    <Text>@vinalicentrodermatologico</Text>
                  </View>
                </View>
              </View>
            </View>

          {/* Patient fields */}
          <View style={styles.fieldsRow}>
              <View style={styles.fieldBox}>
                <Text style={styles.labelText}>Nombre y Apellido:</Text>
                <Text style={styles.underlineField}>{item.paciente?.nombre}</Text>
              </View>
              <View style={styles.fieldBox}>
                <Text style={styles.labelText}>Edad:</Text>
                <Text style={styles.underlineField}>{item.paciente?.edad}</Text>
              </View>
              <View style={styles.fieldBox}>
                <Text style={styles.labelText}>Peso:</Text>
                <Text style={styles.underlineField}>{item.paciente?.peso}</Text>
              </View>
              <View style={styles.fieldBox}>
                <Text style={styles.labelText}>DNI:</Text>
                <Text style={styles.underlineField}>{item.paciente?.documento}</Text>
              </View>
            </View>

          {/* Diagnosis */}
          <Text style={styles.sectionLabel}>Diagnóstico:</Text>
          <Text style={styles.sectionText}>{item.diagnostico || ""}</Text>

          {/* Dates */}
          <Text style={styles.datesText}>
            Fecha de emisión: {item.fechaEmision || ""}  Fecha de vencimiento: {item.fechaVencimiento || ""}
          </Text>
       

          {/* RECETA MAGISTRAL */}
          <Text style={styles.barTitle}>RECETA MAGISTRAL</Text>

          {/* Products */}
          <View style={styles.productsGrid}>
              {item.productos?.map((prod, i) => (
                <View key={i} style={styles.productBlock}>
                  <View style={styles.productLine}>
                    <Text style={styles.descriptionText}>{prod.descripcionproducto}</Text>
                    <Text style={styles.quantityText}>{prod.cantidad}</Text>
                    <Text style={styles.doseText}>{prod.dosis}</Text>
                  </View>
                </View>
              ))}
            </View>
          {/* Additional sections */}
          <View style={styles.extraSection}>
            <Text style={styles.labelText}>Interconsultas:</Text>
            <Text>{item.interconsulta || ""}</Text>
          </View>
          <View style={styles.extraSection}>
            <Text style={styles.labelText}>Servicios:</Text>
            <Text>{item.servicios || ""}</Text>
          </View>
          <View style={styles.extraSection}>
            <Text style={styles.labelText}>Recomendaciones:</Text>
            <Text>{item.recomendaciones || ""}</Text>
          </View>
          <View style={styles.extraSection}>
            <Text style={styles.labelText}>Próxima cita:</Text>
            <Text>{item.proximacita || ""}</Text>
          </View>

          {/* Doctor info */}
          <View style={styles.doctorInfo}>
            <Text>{item.medico?.nombre || ""}</Text>
            <Text> {item.medico?.cmp || ""}</Text>
            <Text>{item.medico?.rne || ""}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default RecetaPDF;

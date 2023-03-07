<template>
  <v-app>
    <v-app-bar>
      <v-container class="d-flex align-center py-0">
        <v-app-bar-title class="pl-0">
          <div class="d-flex align-center">Ribbon</div>
        </v-app-bar-title>
      </v-container>
    </v-app-bar>

    <v-main>
      <section id="hero">
        <v-sheet class="d-flex align-center pb-16" color="grey-darken-3">
          <v-container class="text-center">
            <v-responsive class="mx-auto">
              <h3 class="text-h3">Try Ribbon's all new features</h3>

              <p class="mt-4 text-medium-emphasis">
                Our all-in-one platform gives you the banking, accounting,
                fundraising, and organizational tools you need to build a
                successful charity under the umbrella of your fiscal sponsor.
              </p>
            </v-responsive>
          </v-container>
        </v-sheet>
      </section>

      <v-card class="mx-16 mb-16">
        <v-card-title>
          <h2 class="text-h4">Ribbon Donor List</h2>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="donors.data" :search="search">
          <template v-slot:item="i">
            <tr>
              <td>
                {{ i.item.full_name }}
              </td>
              <td>
                {{ i.item.email }}
              </td>
              <td>
                {{ i.item.total_donations }}
              </td>
              <td>
                {{ i.item.first_donation }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>

      <v-sheet class="py-16" color="#1818181a">
        <section id="grid">
          <v-container>
            <v-row justify="space-between">
              <v-col cols="auto">
                <v-responsive width="350">
                  <h2 class="text-h4">Show your support feature</h2>
                  <p class="text-success mt-3">Available now!</p>
                  <p class="mt-3">
                    Easily send messages to those that have given!
                  </p>
                </v-responsive>
              </v-col>
              <v-sheet width="400" class="mx-auto">
                <v-form
                  v-model="valid"
                  validate-on="submit"
                  @submit.prevent="submit"
                >
                  <v-textarea
                    v-model="message"
                    :rules="messageRules"
                    label="Message"
                  ></v-textarea>
                  <!-- <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="Email"
                  ></v-text-field> -->
                  <v-autocomplete
                    label="Email"
                    :items="emailList"
                    v-model="email"
                    @change="emailChanged"
                  ></v-autocomplete>
                  <v-text-field
                    v-model="donor_id"
                    label="Donor Id"
                  ></v-text-field>
                  <v-btn type="submit" block class="mt-2">Send</v-btn>
                </v-form>
              </v-sheet>
            </v-row>
          </v-container>
        </section>
      </v-sheet>
    </v-main>

    <v-footer>
      <v-container
        class="text-overline d-flex align-center justify-space-between"
      >
        <div>Copyright &copy; 2023 Flourish Change Inc dba Ribbon</div>

        <v-icon icon="mdi-bank" size="x-large" />
      </v-container>
    </v-footer>

    <v-dialog v-model="isShowDialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5">
          {{ isError ? "Error" : "Success" }}
        </v-card-title>

        <v-card-text>
          {{ statusMessage }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="isShowDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "App",

  data() {
    return {
      donors: null,
      valid: false,
      email: "",
      donor_id: "",
      message: "",
      emailRules: [
        (value) => {
          if (value) return true;

          return "E-mail is required.";
        },
      ],
      messageRules: [
        (value) => {
          if (value) return true;

          return "Message is required.";
        },
      ],
      emailList: [],
      isShowDialog: false,
      statusMessage: "",
      isError: false,

      search: "",
      headers: [
        {
          text: "Name",
          align: "start",
          value: "full_name",
        },
        { text: "Email", value: "email" },
        { text: "Total Donations", value: "total_donations" },
        { text: "First Donation", value: "first_donation" },
      ],
    };
  },
  mounted() {
    axios.get("https://interview.ribbon.giving/api/donors").then((response) => {
      this.donors = response.data;
      this.emailList = response.data?.data.map((donor) => ({
        text: donor.email,
        value: donor.email,
      }));
    });
    axios.get("https://interview.ribbon.giving/api/donors").then((response) => {
      this.donors = response.data;
      this.emailList = response.data?.data.map((donor) => ({
        text: donor.email,
        value: donor.email,
      }));
    });
  },
  methods: {
    async submit() {
      // Send message to server.
      if (!this.message || this.message.length < 15) {
        this.isShowDialog = true;
        this.isError = true;
        this.statusMessage =
          "There should be at least 15 characters in your message!";
        return;
      }

      if (!this.email) {
        this.isShowDialog = true;
        this.isError = true;
        this.statusMessage = "Please select an email!";
        return;
      }

      if (!this.donor_id) {
        this.isShowDialog = true;
        this.isError = true;
        this.statusMessage = "Invalid donor id!";
        return;
      }

      const endpoint = `https://interview.ribbon.giving/api/donors/${this.donor_id}/send-message`;

      const headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      };

      const data = {
        message: this.message,
      };

      axios
        .post(endpoint, data, { headers: headers })
        .then((res) => {
          this.isShowDialog = true;
          this.isError = false;
          this.statusMessage = "Submitted!";

          this.message = "";
          this.email = "";
          this.donor_id = "";
        })
        .catch((err) => {
          this.isShowDialog = true;
          this.isError = true;
          this.statusMessage = err;
        });
    },
    emailChanged() {
      let selectedDonor = this.donors.data.find(
        (donor) => donor.email === this.email
      );
      this.donor_id = selectedDonor.id;
      if (!this.message || this.message.length < 15) {
        this.isShowDialog = true;
        this.isError = true;
        this.statusMessage =
          "There should be at least 15 characters in your message!";
        return;
      }

      if (!this.email) {
        this.isShowDialog = true;
        this.isError = true;
        this.statusMessage = "Please select an email!";
        return;
      }

      if (!this.donor_id) {
        this.isShowDialog = true;
        this.isError = true;
        this.statusMessage = "Invalid donor id!";
        return;
      }

      const endpoint = `https://interview.ribbon.giving/api/donors/${this.donor_id}/send-message`;

      const headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      };

      const data = {
        message: this.message,
      };

      axios
        .post(endpoint, data, { headers: headers })
        .then((res) => {
          this.isShowDialog = true;
          this.isError = false;
          this.statusMessage = "Submitted!";

          this.message = "";
          this.email = "";
          this.donor_id = "";
        })
        .catch((err) => {
          this.isShowDialog = true;
          this.isError = true;
          this.statusMessage = err;
        });
    },
    emailChanged() {
      let selectedDonor = this.donors.data.find(
        (donor) => donor.email === this.email
      );
      this.donor_id = selectedDonor.id;
    },
  },
};
</script>

<style scoped>
::v-deep .v-data-table-header {
  background-color: rgb(58, 58, 64, 0.05);
}
</style>
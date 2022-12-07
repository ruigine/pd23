<template>
    <div>
        <v-row class="box" align="center" v-if="!user">
            <v-col>
                <h1 class="mb-12">Login</h1>
                <v-btn class="py-7" @click="dialog=true" dark block>
                    <v-icon class="mr-3">mdi-google</v-icon>Login with Google
                </v-btn>
            </v-col>
        </v-row>
        <v-row class="box" align="center" v-else>
            <v-col>
                <h1 class="mb-12">Welcome!</h1>
                <v-btn class="pa-7" @click="drawer = true" dark>
                    Get Started
                </v-btn>
            </v-col>
        </v-row>

        <v-dialog
            max-width="600"
            v-model="dialog"
        >
            <v-card dark>
                <v-card-text>
                    <div class="text-h5 pa-12" v-if="!pinWrong">Enter given pin:</div>
                    <div class="text-h5 pa-12" v-else>Incorrect pin!</div>
                    <v-text-field
                        v-model="pin"
                        class="px-12"
                        solo
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show ? 'text' : 'password'"
                        name="input-10-1"
                        label="PIN"
                        counter
                        @click:append="show = !show"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions class="justify-end">
                <v-btn
                    text
                    @click="login"
                >Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

    export default {
        data(){
            return {
                dialog: false,
                show: false,
                pin: "",
                pinWrong: false,
                user: null,
            }
        },
        methods: {
            login() {
                if (this.pin == "abc123") {
                    this.dialog = false;
                    const auth = getAuth();
                    const provider = new GoogleAuthProvider();
                    signInWithPopup(auth, provider)
                    .then((result) => {
                        // This gives you a Google Access Token. You can use it to access the Google API.
                        const credential = GoogleAuthProvider.credentialFromResult(result);
                        const token = credential.accessToken;
                        // The signed-in user info.
                        this.user = result.user;
                        console.log(this.user);
                        // ...
                    }).catch((error) => {
                        // Handle Errors here.
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        // The email of the user's account used.
                        const email = error.customData.email;
                        // The AuthCredential type that was used.
                        const credential = GoogleAuthProvider.credentialFromError(error);
                        // ...
                    });
                } else {
                    this.pinWrong = true;
                }
            }
        }
    };
</script>

<style lang="css" scoped>
    .box {
        height: calc(100vh - 64px);
        margin: 0 300px;
    }
</style>
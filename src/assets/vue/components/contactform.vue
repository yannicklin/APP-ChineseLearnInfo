<template>
		<f7-page login-screen>
			<f7-login-screen-title>{{ $t('CONTACT_FORM_TITLE') }}</f7-login-screen-title>
			<f7-list form v-if="formInitialed">
				<f7-list-item>
					<float-label :label="$t('CONTACT_FORM_LABEL_NAME')">
						<f7-input type="text" v-model="cf_name" v-validate="'required'" data-vv-as="Name" name="cf_name" :placeholder="$t('CONTACT_FORM_PLACEHOLDER_NAME')" />
						<span v-show="errors.has('cf_name')" class="help">{{ errors.first('cf_name') }}</span>
					</float-label>
				</f7-list-item>
				<f7-list-item>
					<float-label :label="$t('CONTACT_FORM_LABEL_EMAIL')">
						<f7-input type="email" v-model="cf_email" v-validate="'required|email'" data-vv-as="Email" name="cf_email" :placeholder="$t('CONTACT_FORM_PLACEHOLDER_EMAIL')" />
						<span v-show="errors.has('cf_email')" class="help">{{ errors.first('cf_email') }} {{ $t('CONTACT_FORM_ERROR_FOR_EXAMPLE', { example: 'test@test.org' }) }}</span>
					</float-label>
				</f7-list-item>
				<f7-list-item>
					<float-label :label="$t('CONTACT_FORM_LABEL_PHONE')">
						<f7-input type="tel" v-model="cf_phone" v-validate="{rules: {regex: /^[\+\d]+(?:[\d-.\s()]*)$/ } }" name="cf_phone" data-vv-as="Phone" :placeholder="$t('CONTACT_FORM_PLACEHOLDER_PHONE')" />
						<span v-show="errors.has('cf_phone')" class="help">{{ errors.first('cf_phone') }}  {{ $t('CONTACT_FORM_ERROR_FOR_EXAMPLE', { example: '+1 555 333 222' }) }}</span>
					</float-label>
				</f7-list-item>
				<f7-list-item>
					<float-label :label="$t('CONTACT_FORM_LABEL_MESSAGE')">
						<f7-input type="textarea" v-model="cf_message" v-validate="'required'" data-vv-as="Message" name="cf_message" :placeholder="$t('CONTACT_FORM_PLACEHOLDER_MESSAGE')" />
						<span v-show="errors.has('cf_message')" class="help">{{ errors.first('cf_message') }}</span>
					</float-label>
				</f7-list-item>
			</f7-list>
			<f7-grid>
				<f7-col>
					<f7-button big fill color="red" @click="resetForm">
						{{ $t('CONTACT_FORM_BUTTON_DISCARD') }}
					</f7-button>
				</f7-col>
				<f7-col>
					<f7-button big fill color="blue" @click="sendmail">
						{{ $t('CONTACT_FORM_BUTTON_SEND') }}
					</f7-button>
				</f7-col>
			</f7-grid>
		</f7-page>
</template>

<script>
	export default {
        data: () => ({
            formInitialed: true,
            cf_name: '',
            cf_email: '',
            cf_phone: '',
            cf_message: '',
            httperrors: []
        }),
        methods : {
            postMailviaElasticMail: function(mailJSON){

                this.$ua.trackEvent('Mail from Contact Form', 'Submit');

                this.$http.post('', mailJSON, this.$root.$data.axiosMAIL)
                    .then(response => {
                        this.$f7.alert(this.$i18n.t('CONTACT_FORM_ALERT_SUCCESS', {name: this.cf_name}), this.$i18n.t('ALERT_TITLE_APP'));
                        this.resetForm();
                    })
                    .catch(e => {
                        this.httperrors.push(e);
                        console.log(e);
                    })
            },
			resetForm: function(){
                this.formInitialed = false;
                this.$nextTick(function() {
                    Object.assign(this.$data, this.$options.data());
                    this.$f7.closeModal('#contactform');
                });
			},
            sendmail(){
                var mailJSON = {
                    'username': 'yannicklin@twoudia.com',
                    'apikey': '4433425f-4ac1-45ce-bee5-dc76b56199c0',
                    'from': this.cf_email,
                    'fromName': this.cf_name,
                    'to': 'info@chineselearn.info',
                    'subject': 'Message via Mobile APP - ' + 'Chinese Learn InfoCentre' + ', ' + this.$root.formatDateTime(),
                    'bodyHtml': '<table style="border: 1px dashed black; border-collapse: collapse;">' + '<caption>' + 'Chinese Learn InfoCentre' + '</caption>' +
                    '<tfoot style="color: red;"><tr><td style="border: 1px dashed black; padding: 5px;">Time</td><td style="border: 1px dashed black; padding: 5px;">' + this.$root.formatDateTime() + '</td></tr>' +
                    '<tr><td style="border: 1px dashed black; padding: 5px;">SPEC</td><td style="border: 1px dashed black; padding: 5px;">Platform: ' + device.platform + ', Version: ' + device.version + ', Manufacturer: ' + device.manufacturer + ', Model: ' + device.model + ', UUID: ' + device.uuid + '</td></tr></tfoot>' +
                    '<tbody><tr><td style="border: 1px dashed black; padding: 5px;">Name</td>' + '<td style="border: 1px dashed black; padding: 5px;">' + this.cf_name + '</td></tr>' +
                    '<tr><td style="border: 1px dashed black; padding: 5px;">Email</td>' + '<td style="border: 1px dashed black; padding: 5px;">' + this.cf_email + '</td></tr>' +
                    '<tbody><tr><td style="border: 1px dashed black; padding: 5px;">Phone</td>' + '<td style="border: 1px dashed black; padding: 5px;">' + this.cf_phone + '</td></tr>' +
                    '<tr><td style="border: 1px dashed black; padding: 5px;">Message</td>' + '<td style="border: 1px dashed black; padding: 5px;">' + this.cf_message + '</td></tr></tbody></table>',
                    'bodyText': 'TEXT VERSION: ' + this.cf_message
                };

                this.validateForm(mailJSON);
            },
            validateForm: function(mailJSON){
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.postMailviaElasticMail(mailJSON);
                    } else {
                        this.$f7.alert(this.$i18n.t('CONTACT_FORM_ALERT_ERROR'), this.$i18n.t('ALERT_TITLE_APP'));
					}
                });
            }
		},
        mounted: function() {
            this.$ua.trackView('Contact Form');
        }
	}
</script>

<style>
	.vfl-has-label {
		width: 100%;
	}
	.vfl-label {
		text-transform: uppercase;
		color: #b5b5b5;
	}
	.vfl-label-on-input {
		top: -1em;
	}
	.vfl-label-on-focus {
		color: #ff851b;
	}
	.vfl-label + input {
		padding-left: 0;
		border: 0;
		border-bottom: 2px solid #aaa;
		transition: border 0.2s;
	}
	.vfl-label-on-focus + input  {
		border-bottom: 2px solid #ff851b;
	}
	span.help {
		color: red;
		font-size: 0.8em;
		font-style: italic;
		font-weight: 700;
	}
	.row {
		margin: 10px;
	}
</style>

/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const MaterialComponents = require('material-ui/lib');
const CircularProgress = MaterialComponents.CircularProgress;
const Tabs = MaterialComponents.Tabs;
const Tab = MaterialComponents.Tab;
const Card = MaterialComponents.Card;
const CardText = MaterialComponents.CardText;
const CardHeader = MaterialComponents.CardHeader;
const IconButton = MaterialComponents.IconButton;
const Avatar = require('material-ui/lib/svg-icons/action/grade');
const Dialog = require('material-ui/lib/dialog');
const ThemeManager = require('material-ui/lib/styles/theme-manager');
const LightRawTheme = require('material-ui/lib/styles/raw-themes/light-raw-theme');
const Colors = require('material-ui/lib/styles/colors');

const DetailedView = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getInitialState () {
    return {
      muiTheme: ThemeManager.getMuiTheme(LightRawTheme),
      loading: true,
      title: "...Cargando datos, por favor espere...",
      totalIncome: 0,
      totalOutcome: 0,
      candidates: []
    };
  },

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  componentWillMount() {
    let newMuiTheme = ThemeManager.modifyRawThemePalette(this.state.muiTheme, {
      primary1Color: Colors.red900,
      accent1Color: Colors.red100
    });

    this.setState({muiTheme: newMuiTheme});
  },

  render() {
    let candidateStyle = {
      width: '100%',
      height: '200px',
      textAlign: 'left',
      fontSize: '13px',
      fontFamily: 'Verdana',
      padding: '15px'
    };

    let progressStyle = {
      paddingTop: '300px',
      textAlign: 'center',
      width: '100%',
      height: '100%'
    }

    if(this.state.loading)
    {
      return (
        <div style={progressStyle}>
          <h1>...Cargando datos... </h1><br />
          <h5>Por favor espere</h5>
        </div>
      );
    }
    else
    {
      let totalStyle = {
        fontWeight: '100'
      }

      return <div style={{width: '50%', float: 'right', height: '100%', boxShadow: '-1px -2px 5px 1px #ccc', textAlign: 'center'}}>
          <div style={{height: '50px', width: '100%'}}>
            <h1>{this.state.title}</h1>
          </div>
          <div style={{height: 'calc(100% - 200px)', width: '100%', overflowY:'auto'}}>
            <Tabs>
              <Tab label="Alcaldía" >
                {this.getAlcaldias()}
              </Tab>
              <Tab label="Gobernación" >
                {this.getGobernaciones()}
              </Tab>
            </Tabs>
          </div>
          <div style={{height: '150px', width: '100%', boxShadow: '-1px -2px 11px 0px #ccc', position: 'relative'}}>
            <br />
            <h1><span style={totalStyle}>TOTAL INGRESOS:</span> $ {Math.ceil(this.state.totalIncome).toLocaleString()}</h1>
            <h1><span style={totalStyle}>TOTAL EGRESOS:</span> $ {Math.ceil(this.state.totalOutcome).toLocaleString()}</h1>
          </div>
        </div>
    }
  },

  createItem(item, index) {
    let contributions = 'contribuciones,_donaciones_y_créditos,_en_dinero_o_especie,_que_realicen_los_particulares_(anexo_5.2_b)';
    let capital = 'créditos_o_aportes_que_provengan_del_patrimonio_de_los_candidatos,_de_sus_conyuges__o_de_sus_compañeros_permanentes_o_de_sus_parientes_(anexo_5.1_b).';
    let adds = 'gastos_de_propaganda_electoral_(anexo_5.7_b)';
    let ownRes = 'recursos_propios_de_origen_privado_que_los_partidos_y_movimientos_políticos_destinen_para_el_financiamiento_de_las_campañas_en_las_que_participen_(anexo_5.5_b)';
    let stateRes = 'financiacion_estatal_-_anticipos_(anexo_5.4_b)';
    let invesments = 'inversión_en_materiales_y_publicaciones';
    let publicActs = 'actos_públicos';
    let financialCosts = 'costos_financieros';
    let judicialCosts = 'gastos_judiciales_y_de_rendición_de_cuentas';
    let services = 'servicio_de_transporte_y_correo';
    let others = 'otros_gastos';
    let offices = 'gastos_de_oficina_y_adquisiciones';
    let overSpent = 'gastos_que_sobrepasan_la_suma_fijada_por_el_consejo_nacional_electoral';
    let adminCosts = 'gastos_de_administración';
    let credits = 'créditos_obtenidos_en_entidades_financieras_legalmente_autorizadas_(anexo_5.3_b)';
    let incomingByOwn = 'ingresos_originados_en_actos_publicos,_publicaciones_y/o_cualquier_otra_actividad_lucrativa_del_partido_o_movimiento'
    let totalOutcoming = 'total_de_los_gastos_de_la_campaña';
    let totalIncoming = 'total_de_los_ingresos_de_la_campaña';

    let amountStyle = {
      fontWeight: 'bold'
    };

    var formatAmounts = function(num) {
      return (Math.ceil(num) || 0).toLocaleString();
    };

    return (<Card key={index} initiallyExpanded={false}>
      <CardHeader
        title={item.Nombre}
        subtitle={item.NombreOrganizacion}
        avatar={<Avatar style={{color:'red'}}>A</Avatar>}
        actAsExpander={true}
        showExpandableButton={true}>
      </CardHeader>
      <CardText expandable={true}>
        Contribuciones, donaciones o creditos de particulares: <span style={amountStyle}>$ {formatAmounts(item.formulario5[contributions])}</span> <br />
        Créditos o aportes provenientes del patrimonio de los candidatos: <span style={amountStyle}>$ {formatAmounts(item.formulario5[capital])}</span><br />
        Créditos obtenidos en entidades financieras legalmente autorizadas: <span style={amountStyle}>$ {formatAmounts(item.formulario5[credits])}</span><br />
        Recursos propios de origen privado que los partidos destinen para el financiamiento de sus campañas:  <span style={amountStyle}>$ {formatAmounts(item.formulario5[ownRes])}</span><br />
        Financiación estatal - Anticipos: <span style={amountStyle}>$ {formatAmounts(item.formulario5[stateRes])}</span><br />
        Actos públicos: <span style={amountStyle}>$ {formatAmounts(item.formulario5[publicActs])}</span><br />
        Costos financieros: <span style={amountStyle}>$ {formatAmounts(item.formulario5[financialCosts])}</span><br />
        Gastos judiciales y de rendición de cuentas: <span style={amountStyle}>$ {formatAmounts(item.formulario5[judicialCosts])}</span><br />
        Gastos en publicidad: <span style={amountStyle}>$ {formatAmounts(item.formulario5[adds])}</span><br />
        Servicio de transporte y correo: <span style={amountStyle}>$ {formatAmounts(item.formulario5[services])}</span><br />
        Gastos de oficina y adquisiciones: <span style={amountStyle}>$ {formatAmounts(item.formulario5[offices])}</span><br />
        Gastos que sobrepasan la suma fijada por el consejo nacional electoral: <span style={amountStyle}>$ {formatAmounts(item.formulario5[overSpent])}</span><br />
        Gastos de administración: <span style={amountStyle}>$ {formatAmounts(item.formulario5[adminCosts])}</span><br />
        Inversion en materiales y publicaciones: <span style={amountStyle}>$ {formatAmounts(item.formulario5[invesments])}</span><br />
        Otros gastos: <span style={amountStyle}>$ {formatAmounts(item.formulario5[others])}</span><br />
        Ingresos originados en actos públicos, publicaciones y/o cualquier otra actividad lucrativa del partido: <span style={amountStyle}>$ {formatAmounts(item.formulario5[incomingByOwn])}</span><br />
      </CardText>
      <CardText expandable={true}>
        Total ingresos de la campaña: <span style={amountStyle}>$ {formatAmounts(item.formulario5[totalIncoming])}</span> <br />
        Total gastos de la campaña: <span style={amountStyle}>$ {formatAmounts(item.formulario5[totalOutcoming])}</span> <br />
      </CardText>
    </Card>);
  },

  getAlcaldias() {
    return this.state.candidates.map(function(item, index) {
      if(item.NombreCandidatura === 'Alcaldía')
      {
        return this.createItem(item, index);
      }
    }.bind(this));
  },

  getGobernaciones() {
    return this.state.candidates.map(function(item, index) {
      if(item.NombreCandidatura === 'Gobernación')
      {
        return this.createItem(item, index);
      }
    }.bind(this));
  },

  loadDepData(depData) {
    this.setState({
      loading: false,
      title: depData.name,
      totalIncome: depData.income,
      totalOutcome: depData.outcome,
      candidates: depData.candidates
    });
  },

  loadDepMax(idDepMax) {
    this.loadDepData(idDepMax);
  },

  _handleTouchTap() {
    this.refs.superSecretPasswordDialog.show();
  }

});

module.exports = DetailedView;

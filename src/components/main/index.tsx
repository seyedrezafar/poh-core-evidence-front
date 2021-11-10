import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Web3 from "web3";
import { Button } from "@components";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export const Main: React.FC = () => {
  const [accounts, setAccounts] = useState<any>([]);
  const [web3Enabled, setWeb3Enabled] = useState(false);
  const [hCaptchaVerification, sethCaptchaVerification] = useState(false);

  // Empty web3 instance
  let web3: Web3 = new Web3();

  const ethEnabled: any = async () => {
    if (typeof (window as any).ethereum !== "undefined") {
      // Instance web3 with the provided information from the MetaMask provider information
      web3 = new Web3((window as any).ethereum);
      try {
        // Request account access
        await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });

        return true;
      } catch (e) {
        // User denied access
        return false;
      }
    }

    return false;
  };

  const onClickConnect = async () => {
    if (await !ethEnabled()) {
      alert("Please install MetaMask to use this dApp!");
    }

    

    var accs = await web3.eth.getAccounts();

    const newAccounts = await Promise.all(
      accs.map(async (address: string) => {
        const balance = await web3.eth.getBalance(address);

        // const tokenBalances = await Promise.all(tokenAddresses.map(async (token) => {

        //   const tokenInst = new web3.eth.Contract(tokenABI, token.address);

        //   const balance = await tokenInst.methods.balanceOf(address).call()

        //   return {
        //     token: token.token,
        //     balance
        //   }
        // }))
        console.log(address);
        if(address !== null && address !== undefined)
          setWeb3Enabled(true);
        return {
          address,
          balance: web3.utils.fromWei(balance, "ether"),
          // tokens: tokenBalances
        };
      })
    );

    setAccounts(newAccounts);
  };

  function onClickDisconnect() {
    setAccounts([]);
    setWeb3Enabled(false);
  }

  function handleVerificationSuccess(token: any) {
    sethCaptchaVerification(true);
  }
  function sendDataToChain(){

  }

  return (
    <div className="text-center py-4">
      <Container>
        <Row style={{ minHeight: "80vh" }}>
          <Col
            sm={12}
            className="d-flex justify-content-center align-items-center"
          >
            <Card style={{ maxWidth: "80%" }}>
              <Card.Img variant="top" src="/images/meta-mask.png" />
              <Card.Body>
                <Card.Title>Connect your wallet</Card.Title>
                <Card.Text>To start connect your Meta Mask wallet</Card.Text>
                {!web3Enabled && (
                  <Button onClick={onClickConnect} variant="primary">
                    Connect
                  </Button>
                )}
                {web3Enabled && (
                  <Row className="mt-2">
                    <HCaptcha
                      sitekey="ea3fee38-caf3-4498-b3b9-95c9ac5a23e0"
                      onVerify={(token: string) =>
                        handleVerificationSuccess(token)
                      }
                    />
                  </Row>
                )}
                {hCaptchaVerification && (
                  <Row className='justify-content-center'>
                    <Button onClick={sendDataToChain} variant="success">
                      Send Data To Chain
                    </Button>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
